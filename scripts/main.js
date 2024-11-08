import { Settings } from './settings.js';
import { CryptoRandomGenerator } from './cryptoRandomGenerator.js';

export let cryptoRandomGenerator;

Hooks.once('init', () => {
	Settings.registerSettings();
});

Hooks.once('ready', () => {
	cryptoRandomGenerator = new CryptoRandomGenerator(Settings.isFudgeEnable(), Settings.getPoolSize());
	CONFIG.Dice.randomUniform = () => cryptoRandomGenerator.getRandom();
	// Freeze the Dice class for players to avoid modification (harder to cheat)
	if (!Settings.getOnlyForPlayer() || !game.user.isGM) {
		Object.freeze(CONFIG.Dice);
	}
});

Hooks.on('renderSidebarTab', (app, html, data) => {
	if (app.tabName !== "chat") return;

	if (Settings.isFudgeEnable()) {
		let $chatForm = html.find('#chat-form');
		const template = 'modules/dice-rng-protector/templates/tray.html';
		const dataObject = {
			config: {
				enableFudgePool: Settings.isFudgePoolEnable()
			}
		};
		
		renderTemplate(template, dataObject).then(content => {
			if (content.length > 0) {
				let $content = $(content);
				$chatForm.after($content);
				// Update fudge factor setting when a radio button is clicked
				$content.find("input[type='radio']").on('click', event => {
					let value = $(event.currentTarget).attr('value');
					Settings.fudgeValue = value;
				});

				$content.find("button[data-fudge]").on('click', event => {
					let value = $(event.currentTarget).data('fudge');
					cryptoRandomGenerator.addFudge(value);
				});

				$content.find("button[data-fudge-clear]").on('click', event => {
					cryptoRandomGenerator.clearFudge();
				});
			}
		});
	}
});