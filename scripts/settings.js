export const MODULE_ID = 'dice-rng-protector';

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
	enabledicetray: {
		name: 'dcp.settings.enabledicetray.name',
		hint: 'dcp.settings.enabledicetray.hint',
		scope: 'user',
		config: true,
		type: Boolean,
		default: true,
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
	}
}
export class Settings {
	static fudgeValue = 'NORMAL';
	static getOnlyForPlayer() {
		return game.settings.get(MODULE_ID, 'onlyforplayer');
	}
	static getEnableFudgeDice() {
		return game.settings.get(MODULE_ID, 'enablefudgedice');
	}
	static getEnableDiceTray() {
		return game.settings.get(MODULE_ID, 'enabledicetray');
	}
	static getEnableFudgeDicePool() {
		return game.settings.get(MODULE_ID, 'enablefudgedicepool');
	}
	static getPoolSize() {
		return game.settings.get(MODULE_ID, 'poolsize');
	}
	static registerSettings() {
		for (const [name, setting] of Object.entries(settings)) {
			game.settings.register(MODULE_ID, name, setting);
		}
	}
	static isLocalFudgeEnable() {
		return game.user.role === CONST.USER_ROLES.GAMEMASTER && Settings.getEnableFudgeDice();;
	}
	
	static isLocalFudgePoolEnable() {
		return game.user.role === CONST.USER_ROLES.GAMEMASTER && Settings.getEnableFudgeDicePool();
	}
}