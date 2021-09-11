import { GameVariables } from "../game-variables";
import { SquareObject } from "../objects/square-object";
import { boardPosToGeneralPos, randomNumberOnRange } from "../utilities/util";
import { rectCollision } from "../utilities/collision-utilities";

export class Item {
    constructor() {
        this.itemBoardPosX = 0;
        this.itemBoardPosY = 0;

        this.itemGeneralPosX = 0;
        this.itemGeneralPosY = 0;

        this.itemType = 0;

        this.itemObj = new SquareObject(0, 0, GameVariables.halfSprite, GameVariables.halfSprite);
    }

    get getItemBoardPosX() {
        return this.itemBoardPosX;
    }

    get getItemBoardPosY() {
        return this.itemBoardPosY;
    }

    getItemDisplayMessage(){
        const currentItemMsgs = itemsMsgs[this.itemType];
        return currentItemMsgs[randomNumberOnRange(0, currentItemMsgs.length - 1)];
    }

    generateNewItem(playerXYBoardPos) {
        this.generateNewItemRandomPositions(this.itemBoardPosX, this.itemBoardPosY, playerXYBoardPos);
    }

    generateNewItemRandomPositions(newPosX, newPosY, playerXYBoardPos) {
        const isBuild = newPosX % 2 === 0 && newPosY % 2 === 0;
        const equalsToLastValues = this.itemBoardPosX === newPosX && this.itemBoardPosY === newPosY;
        const equalsToPlayerPos = playerXYBoardPos.x === newPosX && playerXYBoardPos.y === newPosY;
        if (isBuild || equalsToLastValues || equalsToPlayerPos) {
            this.generateNewItemRandomPositions(this.generateRandomNumberInsideBoard(), this.generateRandomNumberInsideBoard(), playerXYBoardPos)
        } else {
            this.itemBoardPosX = newPosX;
            this.itemBoardPosY = newPosY;

            this.itemGeneralPosX = boardPosToGeneralPos(newPosX);
            this.itemGeneralPosY = boardPosToGeneralPos(newPosY);

            this.itemType = randomNumberOnRange(0, items.length - 1);

            this.itemObj.x = this.itemGeneralPosX - GameVariables.oneThirdSprite;
            this.itemObj.y = this.itemGeneralPosY - GameVariables.halfSprite;
        }
    }

    generateRandomNumberInsideBoard() {
        return randomNumberOnRange(1, GameVariables.boardSize - 2);
    }

    drawItem(context) {
        this.drawItemShadow(context);
        this.drawItemSprite(context);
    }

    drawItemShadow(context) {
        for (let y = 0; y < itemShadowSprite.length; y++) {
            for (let x = 0; x < itemShadowSprite[y].length; x++) {
                const currentColor = itemShadowSprite[y][x];
                if (currentColor) {
                    context.beginPath();
                    context.fillStyle = currentColor;
                    context.fillRect(
                        Math.round((this.itemGeneralPosX - GameVariables.oneThirdSprite) + (x * GameVariables.oneSixteenthSprite)),
                        Math.round((this.itemGeneralPosY - GameVariables.oneEighthSprite) + (y * GameVariables.oneSixteenthSprite)),
                        GameVariables.oneSixteenthSprite, GameVariables.oneSixteenthSprite);
                }
            }
        }
    }

    drawItemSprite(context) {
        const spriteToUse = items[this.itemType];
        for (let y = 0; y < spriteToUse.length; y++) {
            for (let x = 0; x < spriteToUse[y].length; x++) {
                const currentColor = spriteToUse[y][x];
                if (currentColor) {
                    context.beginPath();
                    context.fillStyle = currentColor;
                    context.fillRect(
                        Math.round(this.itemObj.x + (x * GameVariables.oneSixteenthSprite)),
                        Math.round(this.itemObj.y + (y * GameVariables.oneSixteenthSprite)),
                        GameVariables.oneSixteenthSprite, GameVariables.oneSixteenthSprite);
                }
            }
        }
    }

    hasCollision(movingObject) {
        return rectCollision(this.itemObj, movingObject);
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

const visorItem = [
    [null, null, null, null, null, null, null, null],
    [null, itemDarkBlueColor, itemBlackColor, itemBlackColor, itemBlackColor, itemBlackColor, null, null],
    [null, itemlightBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemBlackColor, itemBlackColor, null],
    [null, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemShadow, itemBlackColor, null],
    [null, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemBlackColor, itemBlackColor, null],
    [null, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemShadow, itemShadow, null],
    [null, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, null, null, null],
    [null, itemBlackColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, null, null, null]
];

const toiletPaperItem = [
    [null, null, null, null, null, null, null, null],
    [null, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, null, null, null],
    [itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, itemDarkBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, null],
    [itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, itemlightBlueColor],
    [itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, itemlightBlueColor],
    [itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, itemlightBlueColor],
    [itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemDarkBlueColor, itemlightBlueColor],
    [itemBlackColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemlightBlueColor, itemBlackColor, itemBlackColor, itemlightBlueColor]
];

const maskMsgs = ['Nanofibre Mask Almost 100 Effective', 'Luke Im your father!','no kiss allowed', 'allows entrance to shops!', 'dont forget to use it in public transports'];
const gloveMsgs = ['Yes this are gloves', 'This one looks like a used condom but its for your hands', 'Yea they are called gloves', 'its not a condom but gives your hands protection', 'I can shake hands again!'];
const vaccineMsgs = ['Got that Jab!!!', 'Moderna uh thats fancy', 'Didnt even feel a thing', 'I feel safer already', 'that second jab almost killed me', 'if you dont die from the virus you die from the cure', 'security jab update', 'My arm hurts!', 'what doesnt kill you makes you strong'];
const pillMsgs = ['ibuprofen', 'paracetamol', 'Got to keep that Vitamin D up', 'Mmmmm just like candy'];
const soapMsgs = ['wash your hands people!', 'Cant forget to sing happy birthday twice', 'Squeaky clean!', 'thats not lube'];
const glassesMsgs = ['dont forget to protect your eyes', 'Ah! thats where I left them!', 'COVID in my eyes?! NEVER!', 'just like cyclops'];
const visorMsgs = ['Re-used my star wars visor as a covid mask', 'Its a shield! but for your face!', 'visor protection!'];
const toiletPaperMsgs = ['finaly got some toilet paper!!!', 'Phew finally I wipe my ass', 'Ever heard of a bidet?'];

const items = [maskItem, gloveItem, vaccineItem, pillItem, soapItem, glasesItem, visorItem, toiletPaperItem];
const itemsMsgs = [maskMsgs, gloveMsgs, vaccineMsgs, pillMsgs, soapMsgs, glassesMsgs, visorMsgs, toiletPaperMsgs];