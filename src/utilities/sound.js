import { generateRandomNumberBetweenRange } from "./util";

export class Sound {
    constructor() {
        this.context = new AudioContext();
        
        this.loopTime = 0.01;
        this.loopMaxTime = 4;
        this.notesPeerLoop = 32;
        this.currentTime = this.loopMaxTime / this.notesPeerLoop;

        this.bassPosition = 0;
        this.bassNoteCount = 0;

        this.isSoundOn = true;
        this.playAreaSound = false;
    }

    muteMusic() {
        this.isSoundOn = !this.isSoundOn;
    }

    playPickSound() {
        if (this.isSoundOn) {
            this.playSound("square", 932.3, 1, 0, 0.1); // Bb5
            this.playSound("square", 1865, 1, 0.1, 0.2); // Bb6
        }
    }

    playInAreaSound() {
        this.playAreaSound = true;
    }

    stopInAreaSound() {
        this.playAreaSound = false;
    }

    playHumanMusic() {
        if (this.isSoundOn) {
            if (this.currentTime >= (this.loopMaxTime / this.notesPeerLoop)) {
                const randomBassSound = generateRandomNumberBetweenRange(0, 3) === 0 ? '' : cMajorPantonicScale[generateRandomNumberBetweenRange(0, cMajorPantonicScale.length - 1)];
                const randomMelodySound = generateRandomNumberBetweenRange(0, 2) === 0 ? '' : cMinorPantonicScale[generateRandomNumberBetweenRange(0, cMinorPantonicScale.length - 1)];
                this.playSound("square", randomBassSound, 0.3, 0, 0.1);
                this.playSound("Sawtooth", randomMelodySound, 0.3, 0, 0.1);

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
        if (this.isSoundOn) {
            this.playSound("square", 32.70, 1, 0, 0.1); // C1
            this.playSound("square", 36.71, 1, 0.1, 0.2); // D1
            this.playSound("square", 16.35, 1, 0.2, 1); // C0
        }
    }

    playMenuMusic() {
        if (this.isSoundOn) {
            if (this.currentTime >= (this.loopMaxTime / this.notesPeerLoop)) {
                this.playBass();
                this.currentTime = 0;
            } else {
                this.currentTime = this.currentTime + this.loopTime;
            }
        }
    }

    playBass() {
        this.playSound("square", bass[this.bassPosition][1], 0.3, 0, 0.2);
        if (this.bassNoteCount === bass[this.bassPosition][0] - 1) {
            this.bassNoteCount = 0;
            this.bassPosition = this.bassPosition + 1 > bass.length - 1 ? 0 : this.bassPosition + 1;
        } else {
            this.bassNoteCount++;
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

// 16*B1, 16*A1, 8*G1, 8*A1
const bass = [[16, 61.74], [16, 55.00], [8, 49.00], [8, 55.00]];

// const cMajorPantonicScale = [65.41,73.42,82.41,98.00,110.0,130.8];
const cMajorPantonicScale = [32.70,	36.71,41.20,49.00,55.00,65.41];
const cMinorPantonicScale = [1047,1175,1319,1568,1760,2093];