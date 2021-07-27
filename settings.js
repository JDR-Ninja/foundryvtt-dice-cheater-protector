const modName = 'dice-cheater-protector';
const useCrypto = 'usecrypto';
const onlyForPlayer = 'onlyforplayer';

export class Settings {

    static getUseCrypto() {
        return game.settings.get(modName, useCrypto);
    }

    static getOnlyForPlayer() {
        return game.settings.get(modName, onlyForPlayer);
    }

    static registerSettings() {
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
    }
}