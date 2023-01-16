const modName = 'dice-rng-protector';
const settings = {
	usecrypto: {
		name: 'dcp.settings.usecrypto.name',
		hint: 'dcp.settings.usecrypto.hint',
		scope: 'world',
		config: true,
		type: Boolean,
	default: true
	},
	onlyforplayer: {
		name: 'dcp.settings.onlyforplayer.name',
		hint: 'dcp.settings.onlyforplayer.hint',
		scope: 'world',
		config: true,
		type: Boolean,
	default: false
	},
	enablefudgedice: {
		name: 'dcp.settings.enablefudgedice.name',
		hint: 'dcp.settings.enablefudgedice.hint',
		scope: 'world',
		config: true,
		type: Boolean,
	default: false
	}
}

export class Settings {
	static fudgeValue = 'NORMAL';
	
	static getUseCrypto() {
		return game.settings.get(modName, 'usecrypto');
	}

	static getOnlyForPlayer() {
		return game.settings.get(modName, 'onlyforplayer');
	}

	static getEnableFudgeDice() {
		return game.settings.get(modName, 'enablefudgedice');
	}

	static registerSettings() {
		for(const [name, setting] of Object.entries(settings)){
			game.settings.register(modName, name, setting);
		}
	}
}