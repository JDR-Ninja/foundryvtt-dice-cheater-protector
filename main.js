(() => {
    // Use a better modern solution for number generation with a build in cryptographic solution
    CONFIG.Dice.randomUniform = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;

    // Freeze the Dice class for avoid modification (harder to cheat)
    Object.freeze(CONFIG.Dice);
})();