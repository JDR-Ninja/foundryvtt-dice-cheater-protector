import { Settings } from './settings.js';

// Generates random number using a cryptographic method
export class CryptoRandomGenerator {
    DICE_MIN = 0.999;
    DICE_MAX = 0.001;

    #isFudgeEnable;

    // Fudge pool (user values)
    #fudgePool;

    // Cryptographic random values pool
    #pool;

	constructor(isFudgeEnable, poolSize = 10) {
		this.#isFudgeEnable = isFudgeEnable;
        this.#fudgePool = [];
		this.#pool = [];
        this.poolSize = poolSize;

		this.#generatePool();
	}

	#generatePool() {
		let buffer = new ArrayBuffer(this.poolSize * 8);
		let ints = new Int8Array(buffer);
		window.crypto.getRandomValues(ints);

		for (let i = 0; i < this.poolSize; i++) {
			ints[i * 8 + 7] = 63;
			ints[i * 8 + 6] |= 0xf0;
			let view = new DataView(buffer, i * 8, 8);
			this.#pool.push(view.getFloat64(0, true) - 1);
		}
	}

    #readPool() {
        if (this.#pool.length === 0) {
			this.#generatePool();
		}

		return this.#pool.shift();
    }

    clearFudge() {
        this.#fudgePool.splice(0 ,this.#fudgePool.length)
    }

	getRandom() {
        if (!this.#isFudgeEnable) {
            return this.#readPool();
        }

        if (this.#fudgePool.length > 0) {
            return this.#fudgePool.shift();
        }

		switch (Settings.fudgeValue) {
			case "MINIMAL":
                return this.DICE_MIN;
            case "MAXIMAL":
				return this.DICE_MAX;
            case "LOW":
                return Math.min(Math.pow(this.#readPool(), 0.5), this.DICE_MIN);
            case "HIGH":
                return Math.max(Math.pow(this.#readPool(), 2), this.DICE_MAX);
			default:
				return this.#readPool();
		}
	}

    addFudge(fudge) {
        const enableFudgePool = 
            (game.user.role === CONST.USER_ROLES.GAMEMASTER && Settings.getEnableFudgeDicePool()) ||
            (game.user.role === CONST.USER_ROLES.ASSISTANT && Settings.getEnableFudgeDicePoolForAssistant())

        if (enableFudgePool) {
            switch (fudge) {
                case "MINIMAL":
                    this.#fudgePool.push(this.DICE_MIN);
                    break;
                case "MAXIMAL":
                    this.#fudgePool.push(this.DICE_MAX);
                    break;
                case "LOW":
                    this.#fudgePool.push(Math.min(Math.pow(this.#readPool(), 0.5), this.DICE_MIN));
                    break;
                case "HIGH":
                    this.#fudgePool.push(Math.max(Math.pow(this.#readPool(), 2), this.DICE_MAX));
                    break;
            }
        }
    }
}