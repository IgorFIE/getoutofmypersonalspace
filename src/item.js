import { GameVariables } from "./game-variables";

export class Item {
    constructor(mainDiv) {
        this.itemBoardPosX = 0;
        this.itemBoardPosY = 0;
        this.generateNewItemRandomPositions(0, 0)
    }

    generateNewItemRandomPositions(newPosX, newPosY) {
        const isBuild = newPosX % 2 === 0 && newPosY % 2 === 0;
        const equalsToLastValues = this.itemBoardPosX === newPosX && this.itemBoardPosY === newPosY;
        if (isBuild || equalsToLastValues) {
            this.generateNewItemRandomPositions(this.generateRandomNumberInsideBoard(), this.generateRandomNumberInsideBoard())
        } else {
            this.itemBoardPosX = newPosX;
            this.itemBoardPosY = newPosY;
        }
    }

    generateRandomNumberInsideBoard() {
        const min = Math.ceil(1);
        const max = Math.floor(GameVariables.boardSize - 2);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    get getItemBoardPosX() {
        return this.itemBoardPosX;
    }

    get getItemBoardPosY() {
        return this.itemBoardPosY;
    }
}

const items = [maskItem]

const maskItem = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
];