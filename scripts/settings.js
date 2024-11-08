const modName = 'dice-rng-protector';
const settings = {
	onlyforplayer: {
		name: 'dcp.settings.onlyforplayer.name',
		hint: 'dcp.settings.onlyforplayer.hint',
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
        requiresReload: true
	},
	enablefudgedice: {
		name: 'dcp.settings.enablefudgedice.name',
		hint: 'dcp.settings.enablefudgedice.hint',
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
        requiresReload: true
	},
	enablefudgedicepool: {
		name: 'dcp.settings.enablefudgedicepool.name',
		hint: 'dcp.settings.enablefudgedicepool.hint',
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
        requiresReload: true
	},
	enablefudgedicepoolforassistant: {
		name: 'dcp.settings.enablefudgedicepoolforassistant.name',
		hint: 'dcp.settings.enablefudgedicepoolforassistant.hint',
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
        requiresReload: true
	},
	enablefudgediceforassistant: {
		name: 'dcp.settings.enablefudgediceforassistant.name',
		hint: 'dcp.settings.enablefudgediceforassistant.hint',
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
        requiresReload: true
	},
	poolsize: {
		name: 'dcp.settings.poolsize.name',
		hint: 'dcp.settings.poolsize.hint',
		scope: 'world',
		config: true,
		type: Number,
		range: {
			min: 10,
			max: 100,
			step: 10,
		},
		default: 20,
        requiresReload: true
	},
}
export class Settings {
	static fudgeValue = 'NORMAL';
	static getOnlyForPlayer() {
		return game.settings.get(modName, 'onlyforplayer');
	}
	static getEnableFudgeDice() {
		return game.settings.get(modName, 'enablefudgedice');
	}
	static getEnableFudgeDicePool() {
		return game.settings.get(modName, 'enablefudgedicepool');
	}
	static getEnableFudgeDicePoolForAssistant() {
		return game.settings.get(modName, 'enablefudgedicepoolforassistant');
	}
	static getEnableFudgeDiceForAssistant() {
		return game.settings.get(modName, 'enablefudgediceforassistant');
	}
	static getPoolSize() {
		return game.settings.get(modName, 'poolsize');
	}
	static registerSettings() {
		for (const [name, setting] of Object.entries(settings)) {
			game.settings.register(modName, name, setting);
		}
	}
	static isFudgeEnable() {
		return (game.user.role === CONST.USER_ROLES.GAMEMASTER && Settings.getEnableFudgeDice()) ||
				(game.user.role === CONST.USER_ROLES.ASSISTANT && Settings.getEnableFudgeDiceForAssistant());
	}
	
	static isFudgePoolEnable() {
		return (game.user.role === CONST.USER_ROLES.GAMEMASTER && Settings.getEnableFudgeDicePool()) ||
				(game.user.role === CONST.USER_ROLES.ASSISTANT && Settings.getEnableFudgeDicePoolForAssistant());
	}
}