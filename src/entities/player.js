import { GameVariables } from "../game-variables";
import { SquareObject } from "../objects/square-object";
import { CircleObject } from "../objects/circle-object";

export class Player {

    constructor() {
        this.animationCicle = 0;
        this.currentAnimationSprite = 0;

        this.collisionInPlayerArea = false;
        this.currentAreaLevel = 0;
        this.areaLevelCicle = 0;

        this.currentAnxiety = 0;
        this.currentAnxietyLevel = 0;

        const initialPosition = (GameVariables.boardRealSize / 2) - (GameVariables.playerSpriteSize/2);
        this.playerRect = new SquareObject(initialPosition, initialPosition, GameVariables.playerSpriteSize, GameVariables.playerSpriteSize);

        const circleCenter = initialPosition + (GameVariables.playerSpriteSize / 2);
        this.playerArea = new CircleObject(circleCenter, circleCenter, GameVariables.spriteSize);
    }

    getPlayerAnxiety() {
        return this.currentAnxiety;
    }

    getPlayerRect() {
        return this.playerRect;
    }

    getPlayerArea() {
        return this.playerArea;
    }

    setCollisionInPlayerArea(hasCollision) {
        this.collisionInPlayerArea = hasCollision;
    }

    updatePlayerMovement(board, keys, secondsPassed) {
        let newRectX = this.playerRect.x;
        let newRectY = this.playerRect.y;

        let newAreaX = this.playerArea.x;
        let newAreaY = this.playerArea.y;

        const isMultiDirection = keys ? Object.keys(keys).filter((key) => (key == 'd' || key == 'a' || key == 'w' || key == 's') && keys[key]).length > 1 : false;
        const distance = isMultiDirection ? (secondsPassed * GameVariables.playerSpeed) / 1.4142 : secondsPassed * GameVariables.playerSpeed;

        if (keys['d']) { newRectX += distance; newAreaX += distance; }
        if (keys['a']) { newRectX -= distance; newAreaX -= distance; }
        if (keys['w']) { newRectY -= distance; newAreaY -= distance; }
        if (keys['s']) { newRectY += distance; newAreaY += distance; }

        const newPlayerRect = new SquareObject(newRectX, newRectY, this.playerRect.w, this.playerRect.h);
        if (board.hasCollision(newPlayerRect)) {
            newRectX = this.playerRect.x;
            newRectY = this.playerRect.y;
            newAreaX = this.playerArea.x;
            newAreaY = this.playerArea.y;
        }
        this.playerRect.x = newRectX;
        this.playerRect.y = newRectY;
        this.playerArea.x = newAreaX;
        this.playerArea.y = newAreaY;
    }

    updatePlayerAnxietyArea() {
        if (this.collisionInPlayerArea) {
            if (this.areaLevelCicle == GameVariables.playerAreaLevelSpeed && this.currentAreaLevel < playerAreaLevelColors.length - 1) {
                this.areaLevelCicle = 0;
                this.currentAreaLevel++;
            } else {
                if (this.currentAreaLevel !== playerAreaLevelColors.length - 1 ||
                    this.areaLevelCicle !== GameVariables.playerAreaLevelSpeed) {
                    this.areaLevelCicle++;
                }
            }
        } else {
            if (this.areaLevelCicle > 0) {
                this.areaLevelCicle--;
            } else {
                if (this.currentAreaLevel > 0) {
                    this.currentAreaLevel--;
                    this.areaLevelCicle = GameVariables.playerAreaLevelSpeed;
                }
            }
        }
    }

    updatePlayerAnxietyLevel() {
        if (this.collisionInPlayerArea && this.currentAnxiety < GameVariables.playerMaxAnxiety) {
            this.currentAnxiety += 1 + this.currentAreaLevel;
        } else {
            if (this.currentAnxiety > 0) {
                this.currentAnxiety--;
            }
        }

        if (this.currentAnxiety > (GameVariables.playerMaxAnxiety / 4) * 5) {
            this.currentAnxietyLevel = 2;
        } else if (this.currentAnxiety > GameVariables.playerMaxAnxiety / 2) {
            this.currentAnxietyLevel = 1;
        } else {
            this.currentAnxietyLevel = 0;
        }
    }

    drawPlayer(keys, context) {
        this.drawPlayerArea(context);
        this.drawPlayerShadow(context);
        this.drawPlayerSprite(keys, context);
        this.drawAnxietyBar(context);
    }

    drawPlayerArea(context) {
        const areaXPosAjustment = this.playerRect.x - (GameVariables.oneEighthSprite * 13);
        const areaYPosAjustment = this.playerRect.y - (GameVariables.oneEighthSprite * 9);
        for (let y = 0; y < playerAreaSprite.length; y++) {
            for (let x = 0; x < playerAreaSprite[y].length; x++) {
                if (playerAreaSprite[y][x]) {
                    context.beginPath();
                    context.fillStyle = playerAreaLevelColors[this.currentAreaLevel];
                    context.fillRect(
                        areaXPosAjustment + (x * GameVariables.halfSprite),
                        areaYPosAjustment + (y * GameVariables.halfSprite),
                        GameVariables.halfSprite, GameVariables.halfSprite);
                }
            }
        }
    }

    drawPlayerShadow(context) {
        const shadowXPosAjustment = this.playerRect.x - GameVariables.oneEighthSprite;
        const shadowYPosAjustment = this.playerRect.y + (GameVariables.oneEighthSprite * 3);
        for (let y = 0; y < playerShadowSprite.length; y++) {
            for (let x = 0; x < playerShadowSprite[y].length; x++) {
                const currentColor = playerShadowSprite[y][x];
                if (currentColor) {
                    context.beginPath();
                    context.fillStyle = currentColor;
                    context.fillRect(
                        shadowXPosAjustment + (x * GameVariables.oneEighthSprite),
                        shadowYPosAjustment + (y * GameVariables.oneEighthSprite),
                        GameVariables.oneEighthSprite, GameVariables.oneEighthSprite);
                }
            }
        }
    }

    drawPlayerSprite(keys, context) {
        const playerXPosAjustment = this.playerRect.x - GameVariables.oneEighthSprite;
        const playerYPosAjustment = this.playerRect.y - (GameVariables.oneEighthSprite * 3);
        const spriteToUse = this.spriteToUse(keys);
        for (let y = 0; y < spriteToUse.length; y++) {
            for (let x = 0; x < spriteToUse[y].length; x++) {
                const currentColor = spriteToUse[y][x];
                if (currentColor) {
                    context.beginPath();
                    context.fillStyle = currentColor;
                    context.fillRect(
                        playerXPosAjustment + (x * GameVariables.oneEighthSprite),
                        playerYPosAjustment + (y * GameVariables.oneEighthSprite),
                        GameVariables.oneEighthSprite, GameVariables.oneEighthSprite);
                }
            }
        }
    }

    drawAnxietyBar(context) {
        context.beginPath();
        context.fillStyle = playerAnsietyLevelColors[this.currentAnxietyLevel];
        context.fillRect(
            this.playerRect.x - (GameVariables.oneFourthSprite * 3),
            this.playerRect.y - (GameVariables.oneFourthSprite * 5),
            Math.min((this.currentAnxiety * (GameVariables.spriteSize * 2)) / GameVariables.playerMaxAnxiety, GameVariables.spriteSize * 2),
            GameVariables.oneFourthSprite);
    }

    spriteToUse(keys) {
        this.animationCicle++;
        if (this.animationCicle === GameVariables.playerAnimationSpeed) {
            this.currentAnimationSprite = this.currentAnimationSprite === playerFrontWalkingCicle.length - 1 ? 0 : this.currentAnimationSprite + 1;
            this.animationCicle = 0;
        }
        if (keys && keys['d']) { return playerRightWalkingCicle[this.currentAnimationSprite]; }
        if (keys && keys['a']) { return playerLeftWalkingCicle[this.currentAnimationSprite]; }
        if (keys && keys['w']) { return playerBackWalkingCicle[this.currentAnimationSprite]; }
        if (keys && keys['s']) { return playerFrontWalkingCicle[this.currentAnimationSprite]; }
        return playerFrontSprite;
    }
}

const hairColor = '#38252e';
const black = '#000000';
const skinColor = '#e7c688';
const maskWhite = '#9bf2fa';
const maskDark = '#00bcd4';
const shirt = '#703a33';
const gloves = '#38252e';
const boots = '#1b1116';
const shadow = 'rgba(0,0,0,0.5)';

const greenArea = 'rgba(0,255,0,0.3)';
const yellowArea = 'rgba(255,255,0,0.3)';
const redArea = 'rgba(255,0,0,0.3)';
const playerAreaLevelColors = [greenArea, yellowArea, redArea];

const ansietyLevel1 = 'rgba(0,127,255,0.8)';
const ansietyLevel2 = 'rgba(127,0,255,0.8)';
const ansietyLevel3 = 'rgba(255,0,255,0.8)';
const playerAnsietyLevelColors = [ansietyLevel1, ansietyLevel2, ansietyLevel3];

const playerShadowSprite = [
    [null, null, shadow, shadow, shadow, shadow, null, null],
    [null, shadow, shadow, shadow, shadow, shadow, shadow, null],
    [null, null, shadow, shadow, shadow, shadow, null, null],
];

const playerAreaSprite = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, true, true, false, false, false],
    [false, false, true, true, true, true, false, false],
    [false, false, true, true, true, true, false, false],
    [false, false, false, true, true, false, false, false],
    [false, false, false, false, false, false, false, false],
];

const playerFrontSprite = [
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, black, skinColor, skinColor, black, hairColor, null],
    [null, maskWhite, maskDark, maskDark, maskDark, maskDark, maskWhite, null],
    [null, null, maskDark, maskDark, maskDark, maskDark, null, null],
    [null, shirt, shirt, shirt, shirt, shirt, shirt, null],
    [null, gloves, shirt, shirt, shirt, shirt, gloves, null],
    [null, null, boots, null, null, boots, null, null]
];

const playerFrontSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, black, skinColor, skinColor, black, hairColor, null],
    [null, maskWhite, maskDark, maskDark, maskDark, maskDark, maskWhite, null],
    [null, gloves, maskDark, maskDark, maskDark, maskDark, null, null],
    [null, null, shirt, shirt, shirt, gloves, null, null],
    [null, null, boots, null, null, null, null, null]
];

const playerFrontSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, black, skinColor, skinColor, black, hairColor, null],
    [null, maskWhite, maskDark, maskDark, maskDark, maskDark, maskWhite, null],
    [null, null, maskDark, maskDark, maskDark, maskDark, gloves, null],
    [null, null, gloves, shirt, shirt, shirt, null, null],
    [null, null, null, null, null, boots, null, null]
];

const playerBackSprite = [
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, maskWhite, hairColor, hairColor, hairColor, hairColor, maskWhite, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, shirt, shirt, shirt, shirt, shirt, shirt, null],
    [null, gloves, shirt, shirt, shirt, shirt, gloves, null],
    [null, null, boots, null, null, boots, null, null]
];

const playerBackSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, maskWhite, hairColor, hairColor, hairColor, hairColor, maskWhite, null],
    [null, shirt, hairColor, hairColor, hairColor, hairColor, gloves, null],
    [null, gloves, shirt, shirt, shirt, shirt, null, null],
    [null, null, null, null, null, boots, null, null]
];

const playerBackSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, maskWhite, hairColor, hairColor, hairColor, hairColor, maskWhite, null],
    [null, gloves, hairColor, hairColor, hairColor, hairColor, shirt, null],
    [null, null, shirt, shirt, shirt, shirt, gloves, null],
    [null, null, boots, null, null, null, null, null]
];

const playerRightSprite = [
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, skinColor, black, skinColor, null],
    [null, hairColor, hairColor, hairColor, maskWhite, maskDark, maskDark, null],
    [null, null, hairColor, maskWhite, maskWhite, maskDark, maskDark, null],
    [null, null, shirt, shirt, shirt, shirt, null, null],
    [null, null, shirt, gloves, gloves, shirt, null, null],
    [null, null, null, boots, boots, null, null, null]
];

const playerRightSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, skinColor, black, skinColor, null],
    [null, hairColor, hairColor, hairColor, maskWhite, maskDark, maskDark, null],
    [null, null, hairColor, maskWhite, maskWhite, maskDark, maskDark, null],
    [null, null, gloves, shirt, shirt, shirt, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const playerRightSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, skinColor, black, skinColor, null],
    [null, hairColor, hairColor, hairColor, maskWhite, maskDark, maskDark, null],
    [null, null, hairColor, maskWhite, maskWhite, maskDark, maskDark, null],
    [null, null, shirt, shirt, shirt, gloves, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const playerLeftSprite = [
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, black, skinColor, hairColor, hairColor, hairColor, null],
    [null, maskDark, maskDark, maskWhite, hairColor, hairColor, hairColor, null],
    [null, maskDark, maskDark, maskWhite, maskWhite, hairColor, null, null],
    [null, null, shirt, shirt, shirt, shirt, null, null],
    [null, null, shirt, gloves, gloves, shirt, null, null],
    [null, null, null, boots, boots, null, null, null]
];

const playerLeftSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, black, skinColor, hairColor, hairColor, hairColor, null],
    [null, maskDark, maskDark, maskWhite, hairColor, hairColor, hairColor, null],
    [null, maskDark, maskDark, maskWhite, maskWhite, hairColor, null, null],
    [null, null, shirt, shirt, shirt, gloves, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const playerLeftSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, black, skinColor, hairColor, hairColor, hairColor, null],
    [null, maskDark, maskDark, maskWhite, hairColor, hairColor, hairColor, null],
    [null, maskDark, maskDark, maskWhite, maskWhite, hairColor, null, null],
    [null, null, gloves, shirt, shirt, shirt, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const playerFrontWalkingCicle = [playerFrontSpriteWalk1, playerFrontSprite, playerFrontSpriteWalk2, playerFrontSprite];
const playerBackWalkingCicle = [playerBackSpriteWalk1, playerBackSprite, playerBackSpriteWalk2, playerBackSprite];
const playerRightWalkingCicle = [playerRightSpriteWalk1, playerRightSprite, playerRightSpriteWalk2, playerRightSprite];
const playerLeftWalkingCicle = [playerLeftSpriteWalk1, playerLeftSprite, playerLeftSpriteWalk2, playerLeftSprite];
