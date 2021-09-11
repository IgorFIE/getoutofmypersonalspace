import { randomNumberOnRange } from "./util";

export class Sound {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();

        this.loopTime = 0.01;
        this.loopMaxTime = 4;
        this.notesPeerLoop = 32;
        this.currentTime = this.loopMaxTime / this.notesPeerLoop;

        this.isSoundOn = true;
        this.playAreaSound = false;
        this.isSoundInitialized = false;
    }

    muteMusic() {
        this.isSoundOn = !this.isSoundOn;
    }

    initSound() {
        this.isSoundInitialized = true;
    }

    playPickSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 932.3, 0.3, 0, 0.1); // Bb5
            this.playSound("square", 1865, 0.5, 0.1, 0.2); // Bb6
        }
    }

    playInAreaSound() {
        this.playAreaSound = true;
    }

    stopInAreaSound() {
        this.playAreaSound = false;
    }

    playHumanMusic() {
        if (this.isSoundOn && this.isSoundInitialized) {
            if (this.currentTime >= (this.loopMaxTime / this.notesPeerLoop)) {
                const randomBassSound = randomNumberOnRange(0, 3) === 0 ? '' : cMajorPantonicScale[randomNumberOnRange(0, cMajorPantonicScale.length - 1)];
                const randomMelodySound = randomNumberOnRange(0, 2) === 0 ? '' : cMinorPantonicScale[randomNumberOnRange(0, cMinorPantonicScale.length - 1)];
                this.playSound("square", randomBassSound, 0.25, 0, 0.1);
                this.playSound("sine", randomMelodySound, 0.3, 0, 0.1);

                if (this.playAreaSound) {
                    this.playSound("square", 1397, 0.3, 0, 0.1); // F6
                }
                this.currentTime = 0;
            } else {
                this.currentTime = this.currentTime + this.loopTime;
            }
        }
    }

    playGameOverSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 32.70, 0.5, 0, 0.1); // C1
            this.playSound("square", 36.71, 0.3, 0.1, 0.2); // D1
            this.playSound("square", 16.35, 0.5, 0.2, 1); // C0
        }
    }

    playSound(type, value, volume, start, end) {
        const o = this.context.createOscillator();
        const g = this.context.createGain();
        o.type = type;
        o.frequency.value = value;
        g.gain.value = volume;
        o.connect(g);
        g.connect(this.context.destination);
        o.start(start);
        o.stop(this.context.currentTime + end);
    }
}

const cMajorPantonicScale = [32.70, 36.71, 41.20, 49.00, 55.00, 65.41];
const cMinorPantonicScale = [1047, 1175, 1319, 1568, 1760, 2093];