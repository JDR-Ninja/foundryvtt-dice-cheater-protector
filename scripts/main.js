import { Settings } from './settings.js';
import { CryptoRandomGenerator } from './cryptoRandomGenerator.js';

export let cryptoRandomGenerator;

function setFudgeAndUI(fudge, selector) {
	Settings.fudgeValue = fudge;
	if (Settings.getEnableDiceTray())
		document.querySelector(selector).checked = true;
	cryptoRandomGenerator.sendSetFudge(Settings.fudgeValue);
}

function setKeybinds() {
	game.keybindings.register('dice-rng-protector', "fudgeMinimal", {
			name: 'dcp.keybindings.minimal',
			editable: [{ key: 'Digit1', modifiers: ['Control', 'Shift'] }],
			onDown: () =>
			{
				if (!Settings.isLocalFudgeEnable())
					return false;
				setFudgeAndUI('MINIMAL', 'input[id="dcp-dice-min"]');
				return true; //  If True is returned, the event is consumed and no further keybinds execute.
			},
			restricted: true // If true, only a GM can edit and execute this Action.
		});
	
		game.keybindings.register('dice-rng-protector', "fudgeLow", {
			name: 'dcp.keybindings.low',
			editable: [{ key: 'Digit2', modifiers: ['Control', 'Shift'] }],
			onDown: () => {
				if (!Settings.isLocalFudgeEnable())
					return false;
				setFudgeAndUI('LOW', 'input[id="dcp-dice-low"]');
				return true;
			},
			restricted: true
		});
		
		game.keybindings.register('dice-rng-protector', "fudgeNormal", {
			name: 'dcp.keybindings.normal',
			editable: [{ key: 'Digit3', modifiers: ['Control', 'Shift'] }],
			onDown: () => {
				if (!Settings.isLocalFudgeEnable())
					return false;
				setFudgeAndUI('NORMAL', 'input[id="dcp-dice-normal"]');
				return true;
			},
			restricted: true
		});
		
		game.keybindings.register('dice-rng-protector', "fudgeHigh", {
			name: 'dcp.keybindings.high',
			editable: [{ key: 'Digit4', modifiers: ['Control', 'Shift'] }],
			onDown: () => {
				if (!Settings.isLocalFudgeEnable())
					return false;
				setFudgeAndUI('HIGH', 'input[id="dcp-dice-high"]');
				return true;
			},
			restricted: true
		});
		
		game.keybindings.register('dice-rng-protector', "fudgeMaximal", {
			name: 'dcp.keybindings.maximal',
			editable: [{ key: 'Digit5', modifiers: ['Control', 'Shift'] }],
			onDown: () => {
				if (!Settings.isLocalFudgeEnable())
					return false;
				setFudgeAndUI('MAXIMAL', 'input[id="dcp-dice-max"]');
				return true;
			},
			restricted: true
		});

		game.keybindings.register('dice-rng-protector', "toggleDiceTray", {
			name: 'dcp.keybindings.toggledicetray',
			editable: [{ key: 'Backspace', modifiers: ['Control', 'Shift'] }],
			onDown: () =>
			{
				if (!Settings.isLocalFudgeEnable())
					return false;

				if (Settings.getEnableDiceTray())
					document.querySelectorAll('section.dcp-tray').forEach((section) => {
						if (section.style.display === 'none')
							section.style.display = 'flex';
						else
							section.style.display = 'none';
					});

				return true;
			},
			restricted: true
		});
}

function applyListeners(html) {
	const template = 'modules/dice-rng-protector/templates/tray.html';
		const dataObject = {
			config: {
				enableFudgePool: Settings.isLocalFudgePoolEnable()
			}
		};
	
	let $chatForm;
	let renderTemplateFn;
	if (foundry.utils.isNewerVersion(game.version, 13)) {
		$chatForm = html.querySelector('.chat-form');
		renderTemplateFn = foundry.applications.handlebars.renderTemplate;

	} else {
		$chatForm = html[0].querySelector('#chat-form');
		renderTemplateFn= renderTemplate;
	}

	renderTemplateFn("modules/dice-rng-protector/templates/tray.html", dataObject)
		.then(content => {
			if (content.length > 0) {
				$chatForm.insertAdjacentHTML('afterend', content);
				
				// Update fudge factor setting when a radio button is clicked
				const diceTray = $chatForm.nextElementSibling;

				const syncButton = diceTray.querySelector('input[type="checkbox"][id=dcp-sync]');
				syncButton.addEventListener("click", (event) => {
					if (event.currentTarget.checked) {
						event.currentTarget.parentElement.title = game.i18n.localize('dcp.SyncWithPlayer');
						cryptoRandomGenerator.sendSetFudge(Settings.fudgeValue);
					} else {
						event.currentTarget.parentElement.title = game.i18n.localize('dcp.NotSyncWithPlayer');
						cryptoRandomGenerator.sendReset();
					}
				});

				const diceButtons = diceTray.querySelectorAll('input[type="radio"][id^=dcp-dice-]');
				
				diceButtons.forEach((radio) => {
					radio.addEventListener("click", (event) => {
						Settings.fudgeValue = event.currentTarget.value;
						if (syncButton.checked) {
							cryptoRandomGenerator.sendSetFudge(event.currentTarget.value);
						}
					});
				});

				if (Settings.isLocalFudgePoolEnable()) {
					const fudgeButtons = diceTray.nextElementSibling.querySelectorAll('button.dcp-fudge');
					fudgeButtons.forEach((button) => {
						button.addEventListener("click", (event) => {
							event.preventDefault();
							const dataset = event.currentTarget.dataset;
							
							if (dataset.fudgeClear === undefined) {
								cryptoRandomGenerator.addFudge(dataset.fudge);
								if (syncButton.checked) {
									cryptoRandomGenerator.sendAddFudge(dataset.fudge);
								}
							} else {
								cryptoRandomGenerator.clearFudge();
								if (syncButton.checked) {
									cryptoRandomGenerator.sendClearFudge();
								}
							}
						});
					
					});
				}
			}
		});
}

Hooks.once('init', () => {
	Settings.registerSettings();
	setKeybinds();

	if (foundry.utils.isNewerVersion(game.version, 13)) {
		foundry.applications.handlebars.loadTemplates(['modules/dice-rng-protector/templates/tray.html']);
	}
});

Hooks.once('ready', () => {
	cryptoRandomGenerator = new CryptoRandomGenerator(Settings.getEnableFudgeDice(), Settings.getPoolSize());
	CONFIG.Dice.randomUniform = () => cryptoRandomGenerator.getRandom();
	CONFIG.Dice.fulfillment.methods.mersenne.handler = term => term.mapRandomFace(cryptoRandomGenerator.getRandom());
	
	// Freeze the Dice class for players to avoid modification (harder to cheat)
	if (!Settings.getOnlyForPlayer() || !game.user.isGM) {
		Object.freeze(CONFIG.Dice);
		Object.freeze(CONFIG.Dice.fulfillment.methods.mersenne.handler);
	}
});

Hooks.on("renderChatLog", async (chatlog, html, data, opt) => {
	if (foundry.utils.isNewerVersion(game.version, 13) && !opt.isFirstRender) return;
	if (!Settings.isLocalFudgeEnable() || !Settings.getEnableDiceTray()) return;

	applyListeners(html);
});

Hooks.on('userConnected', (user, connected) => {
	if (game.user.role !== CONST.USER_ROLES.GAMEMASTER) {
		if (user.isGM && connected === false) {
		Settings.fudgeValue = 'NORMAL';
		cryptoRandomGenerator.clearFudge();
		}
	}
 });