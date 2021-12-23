import { Settings } from './settings.js';

function getCryptoRandom() {
    return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
    // Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295) * 20) + 1
}

function getRandom() {
    if (Settings.fudgeValue == "MINIMAL") return 0.001;
    if (Settings.fudgeValue == "MAXIMAL") return 1;

    let r = getCryptoRandom();

    if (Settings.fudgeValue == "NORMAL") return r;

    if (Settings.fudgeValue == "HIGH") {
        if (r < 0.49 && getCryptoRandom() >= 0.5) {
            return r * 2;
        }
    }

    else if (Settings.fudgeValue == "LOW") {
        if (r > 0.49 && getCryptoRandom() >= 0.5) {
            return r / 2;
        }
    }

    return r;
}

Hooks.once('init', () => {
    Settings.registerSettings();
});

Hooks.once('ready', () => {
    if (Settings.getEnableFudgeDice()) {
        CONFIG.Dice.randomUniform = getRandom;
    }

    else if (Settings.getUseCrypto()) {
        // Use a better modern solution for number generation with a build in cryptographic solution
        CONFIG.Dice.randomUniform = getCryptoRandom;
    }

    if (!Settings.getOnlyForPlayer() || !game.user.isGM) {
        // Freeze the Dice class for avoid modification (harder to cheat)
        Object.freeze(CONFIG.Dice);
    }
});

Hooks.on('renderSidebarTab', (app, html, data) => {
    if (!game.user.isGM || !Settings.getEnableFudgeDice()) {
        return;
    }

    let $chat_form = html.find('#chat-form');
    const template = 'modules/dice-cheater-protector/templates/tray.html';
    const data_object = {};

    renderTemplate(template, data_object).then(c => {
        if (c.length > 0) {
            let $content = $(c);
            $chat_form.after($content);

            $content.find("input[type='radio']").on('click', event => {
                let $self = $(event.currentTarget);
                let value = $self.attr('value');

                Settings.fudgeValue = value;
            });
        }
    });
})

