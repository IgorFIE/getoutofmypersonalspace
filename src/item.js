import { GameVariables } from "./game-variables";
import { SquareObject } from "./square-object";
import { convertBoardPosToGeneralPos } from "./util";
import { rectCollision } from "./collision-utilities";

export class Item {
    constructor(mainDiv) {
        this.itemBoardPosX = 0;
        this.itemBoardPosY = 0;

        this.itemGeneralPosX = 0;
        this.itemGeneralPosY = 0;

        this.itemType = 0;

        this.itemObj = new SquareObject(0, 0, GameVariables.halfSprite, GameVariables.halfSprite);

        this.canvas = document.createElement('canvas');
        const spriteWithMultiplier = GameVariables.spriteSize * GameVariables.boardScaleMultiplier;
        this.canvas.width = GameVariables.boardSize * spriteWithMultiplier;
        this.canvas.height = GameVariables.boardSize * spriteWithMultiplier;
        mainDiv.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
    }

    generateNewItem() {
        this.cleanItem();
        this.generateNewItemRandomPositions(this.itemBoardPosX, this.itemBoardPosY);
        this.drawItem();
    }

    generateNewItemRandomPositions(newPosX, newPosY) {
        const isBuild = newPosX % 2 === 0 && newPosY % 2 === 0;
        const equalsToLastValues = this.itemBoardPosX === newPosX && this.itemBoardPosY === newPosY;
        if (isBuild || equalsToLastValues) {
            this.generateNewItemRandomPositions(this.generateRandomNumberInsideBoard(), this.generateRandomNumberInsideBoard())
        } else {
            this.itemBoardPosX = newPosX;
            this.itemBoardPosY = newPosY;

            this.itemGeneralPosX = convertBoardPosToGeneralPos(newPosX);
            this.itemGeneralPosY = convertBoardPosToGeneralPos(newPosY);

            this.itemType = this.generateRandomItemType();

            this.itemObj.x = this.itemGeneralPosX - (GameVariables.spriteSize / 3);
            this.itemObj.y = this.itemGeneralPosY - GameVariables.halfSprite;
        }
    }

    generateRandomNumberInsideBoard() {
        const min = Math.ceil(1);
        const max = Math.floor(GameVariables.boardSize - 2);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateRandomItemType() {
        const min = 0;
        const max = items.length - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    cleanItem() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawItem() {
        // Draw Item Shadow
        for (let y = 0; y < itemShadowSprite.length; y++) {
            for (let x = 0; x < itemShadowSprite[y].length; x++) {
                const currentColor = itemShadowSprite[y][x];
                if (currentColor) {
                    this.context.beginPath();
                    this.context.fillStyle = currentColor;
                    this.context.fillRect(
                        (this.itemGeneralPosX - (GameVariables.spriteSize / 3)) + (x * (GameVariables.halfSprite / 8)),
                        (this.itemGeneralPosY - (GameVariables.spriteSize / 8)) + (y * (GameVariables.halfSprite / 8)),
                        (GameVariables.halfSprite / 8), (GameVariables.halfSprite / 8));
                }
            }
        }

        // Draw Item
        const spriteToUse = items[this.itemType];
        for (let y = 0; y < spriteToUse.length; y++) {
            for (let x = 0; x < spriteToUse[y].length; x++) {
                const currentColor = spriteToUse[y][x];
                if (currentColor) {
                    this.context.beginPath();
                    this.context.fillStyle = currentColor;
                    this.context.fillRect(
                        this.itemObj.x + (x * (GameVariables.halfSprite / 8)),
                        this.itemObj.y + (y * (GameVariables.halfSprite / 8)),
                        (GameVariables.halfSprite / 8), (GameVariables.halfSprite / 8));
                    this.context.stroke();
                }
            }
        }
    }

    updateItem(x, y) {
        this.canvas.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

    hasCollision(movingObject) {
        return rectCollision(this.itemObj, movingObject);
    }

    get getItemBoardPosX() {
        return this.itemBoardPosX;
    }

    get getItemBoardPosY() {
        return this.itemBoardPosY;
    }
}

const itemDarkBlueColor = "#00bcd4";
const itemlightBlueColor = "#9bf2fa";
const itemRedColor = "#a80000";
const itemBlackColor = "black";
const itemShadow = 'rgba(0,0,0,0.5)';

const itemShadowSprite = [
    [null, null, null, null, null, null, null, null],
    [null, null, itemShadow, itemShadow, itemShadow, itemShadow, null, null],
    [null, itemShadow, itemBlackColor, itemBlackColor, itemBlackColor, itemBlackColor, itemShadow, null],
    [null, null, itemShadow, itemShadow, itemShadow, itemShadow, null, null],
];

const maskItem = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, itemlightBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemlightBlueColor, null],
    [itemlightBlueColor, itemShadow, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemShadow, itemlightBlueColor],
    [itemlightBlueColor, null, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, null, itemlightBlueColor],
    [itemShadow, itemlightBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemlightBlueColor, itemShadow],
    [null, itemBlackColor, itemBlackColor, itemBlackColor, itemBlackColor, itemBlackColor, itemBlackColor, null]
];

const gloveItem = [
    [null, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, null, null, null, null],
    [null, itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, null, null, null, null],
    [null, itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, itemDarkBlueColor, null, null],
    [null, itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, null],
    [itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, null],
    [itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, null],
    [itemShadow, itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor],
    [null, itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor]
];

const vaccineItem = [
    [null, null, null, null, null, null, null, itemlightBlueColor],
    [null, null, null, null, null, null, itemlightBlueColor, itemShadow],
    [null, null, null, null, itemDarkBlueColor, itemDarkBlueColor, itemShadow, null],
    [null, itemlightBlueColor, itemShadow, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemShadow, null],
    [null, itemShadow, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, itemShadow, null, null],
    [itemlightBlueColor, itemShadow, itemlightBlueColor, itemlightBlueColor, itemShadow, null, null, null],
    [itemShadow, itemlightBlueColor, itemShadow, itemShadow, itemlightBlueColor, , null, null],
    [null, itemBlackColor, itemlightBlueColor, null, itemBlackColor, null, null, null]
];

const pillItem = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, itemDarkBlueColor, itemDarkBlueColor, null, null],
    [null, null, null, itemDarkBlueColor, itemlightBlueColor, itemDarkBlueColor, itemDarkBlueColor, null],
    [null, null, itemRedColor, itemlightBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, null],
    [null, itemRedColor, itemlightBlueColor, itemRedColor, itemDarkBlueColor, itemDarkBlueColor, itemShadow, null],
    [null, itemRedColor, itemRedColor, itemRedColor, itemRedColor, itemShadow, null, null],
    [null, itemShadow, itemRedColor, itemRedColor, itemShadow, null, null, null],
    [null, null, itemBlackColor, itemBlackColor, null, null, null, null]
];

const soapItem = [
    [null, null, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, null, null, null],
    [null, null, itemShadow, itemDarkBlueColor, itemDarkBlueColor, null, null, null],
    [null, null, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, null, null],
    [null, null, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, null, null],
    [null, null, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, null, null],
    [null, null, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, null, null],
    [null, null, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, null, null],
    [null, null, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, null, null]
];

const glasesItem = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, null],
    [itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor],
    [itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor],
    [itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor],
    [itemShadow, itemDarkBlueColor, itemDarkBlueColor, itemShadow, itemShadow, itemDarkBlueColor, itemDarkBlueColor, itemShadow],
    [null, itemBlackColor, itemBlackColor, null, null, itemBlackColor, itemBlackColor, null]
];

const items = [maskItem, gloveItem, vaccineItem, pillItem, soapItem, glasesItem];