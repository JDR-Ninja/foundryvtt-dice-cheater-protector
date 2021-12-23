const modName = 'dice-cheater-protector';
const useCrypto = 'usecrypto';
const onlyForPlayer = 'onlyforplayer';
const enableFudgeDice = "enablefudgedice";

export class Settings {

    static fudgeValue = 'NORMAL';

    static getUseCrypto() {
        return game.settings.get(modName, useCrypto);
    }

    static getOnlyForPlayer() {
        return game.settings.get(modName, onlyForPlayer);
    }

    static getEnableFudgeDice() {
        return game.settings.get(modName, enableFudgeDice);
    }

    static registerSettings() {
        // https://foundryvtt.com/api/ClientSettings.html#register

        game.settings.register(modName, useCrypto, {
            name: 'dcp.settings.usecrypto.name',
            hint: 'dcp.settings.usecrypto.hint',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true
        });

        game.settings.register(modName, onlyForPlayer, {
            name: 'dcp.settings.onlyforplayer.name',
            hint: 'dcp.settings.onlyforplayer.hint',
            scope: 'world',
            config: true,
            type: Boolean,
            default: false
        });

        game.settings.register(modName, onlyForPlayer, {
            name: 'dcp.settings.onlyforplayer.name',
            hint: 'dcp.settings.onlyforplayer.hint',
            scope: 'world',
            config: true,
            type: Boolean,
            default: false
        });

        game.settings.register(modName, enableFudgeDice, {
            name: 'dcp.settings.enablefudgedice.name',
            hint: 'dcp.settings.enablefudgedice.hint',
            scope: 'world',
            config: true,
            type: Boolean,
            default: false
        });
    }
}