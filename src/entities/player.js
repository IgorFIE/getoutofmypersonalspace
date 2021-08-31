import { GameVariables } from "../game-variables";
import { SquareObject } from "../objects/square-object";
import { CircleObject } from "../objects/circle-object";

export class Player {

    constructor(mainDiv) {
        const initialPosition = (GameVariables.spriteSize * GameVariables.boardScaleMultiplier * GameVariables.boardSize) / 2;
        this.x = -initialPosition + (GameVariables.gameWidth / 2);
        this.y = -initialPosition + (GameVariables.gameHeight / 2);
        this.playerWidthPos = (GameVariables.gameWidth / 2) - GameVariables.halfSprite;
        this.playerHeightPos = (GameVariables.gameHeight / 2) - GameVariables.halfSprite;
        this.speed = GameVariables.playerSpeed;
        this.sanity = 0;

        this.playerBoardObj = new SquareObject(initialPosition - GameVariables.halfSprite, initialPosition + (GameVariables.halfSprite / 4), GameVariables.spriteSize, GameVariables.halfSprite);
        this.playerObj = new SquareObject(this.x, this.y + GameVariables.halfSprite, GameVariables.spriteSize, GameVariables.halfSprite);
        this.playerArea = new CircleObject(this.x, this.y + GameVariables.halfSprite, GameVariables.spriteSize);

        const canvas = document.createElement('canvas');
        canvas.width = GameVariables.gameWidth;
        canvas.height = GameVariables.gameHeight;
        mainDiv.appendChild(canvas);

        this.context = canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;

        this.animationCicle = 0;
        this.currentAnimationSprite = 0;

        this.collisionInArea = false;
        this.currentAreaLevel = 0;
        this.areaLevelCicle = 0;

        this.currentAnsiety = 0;
        this.currentAnsietyLevel = 0;
    }

    getPlayerAnsiety(){
        return this.currentAnsiety;
    }

    getPlayerBoardObj() {
        return this.playerBoardObj;
    }

    getPlayerObj() {
        return this.playerObj;
    }

    getPlayerArea() {
        return this.playerArea;
    }

    setCollisionInArea(hasCollision) {
        this.collisionInArea = hasCollision;
    }

    cleanPlayer() {
        this.context.clearRect(0, 0, GameVariables.gameWidth, GameVariables.gameHeight);
    }

    upgradePlayer() {
        this.updatePlayerCollisionParams();
        this.updatePlayerAnsietyParams();
    }

    updatePlayerCollisionParams() {
        if (this.collisionInArea) {
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

    updatePlayerAnsietyParams() {
        if (this.collisionInArea && this.currentAnsiety < GameVariables.playerMaxAnsiety) {
            this.currentAnsiety += 1 + this.currentAreaLevel;
        } else {
            if (this.currentAnsiety > 0) {
                this.currentAnsiety--;
            }
        }

        if (this.currentAnsiety > (GameVariables.playerMaxAnsiety / 2 + GameVariables.playerMaxAnsiety / 4)) {
            this.currentAnsietyLevel = 2;
        } else if (this.currentAnsiety > GameVariables.playerMaxAnsiety / 2) {
            this.currentAnsietyLevel = 1;
        } else {
            this.currentAnsietyLevel = 0;
        }
    }

    // should only draw new image if I need to update it, I should not be always redrawing it
    drawPlayer(keys) {
        // Draw Player Area
        for (let y = 0; y < playerAreaSprite.length; y++) {
            for (let x = 0; x < playerAreaSprite[y].length; x++) {
                const currentAreaColor = playerAreaSprite[y][x]; //todo convert this into a boolead list maybe
                if (currentAreaColor) {
                    this.context.beginPath();
                    this.context.fillStyle = playerAreaLevelColors[this.currentAreaLevel];
                    this.context.fillRect(
                        this.playerWidthPos + (x * (GameVariables.halfSprite)) - (GameVariables.spriteSize + (GameVariables.spriteSize / 2)),
                        this.playerHeightPos + (y * (GameVariables.halfSprite)) - (GameVariables.halfSprite / 4) - GameVariables.halfSprite,
                        (GameVariables.halfSprite), (GameVariables.halfSprite));
                }
            }
        }

        // Draw Player Shadow
        for (let y = 0; y < playerShadowSprite.length; y++) {
            for (let x = 0; x < playerShadowSprite[y].length; x++) {
                const currentColor = playerShadowSprite[y][x];
                if (currentColor) {
                    this.context.beginPath();
                    this.context.fillStyle = currentColor;
                    this.context.fillRect(
                        this.playerWidthPos + (x * (GameVariables.halfSprite / 4)),
                        (GameVariables.spriteSize - GameVariables.spriteSize / 4) + this.playerHeightPos + (y * (GameVariables.halfSprite / 4)),
                        (GameVariables.halfSprite / 4), (GameVariables.halfSprite / 4));
                }
            }
        }

        // Draw Player
        const spriteToUse = this.spriteToUse(keys);
        for (let y = 0; y < spriteToUse.length; y++) {
            for (let x = 0; x < spriteToUse[y].length; x++) {
                const currentColor = spriteToUse[y][x];
                if (currentColor) {
                    this.context.beginPath();
                    this.context.fillStyle = currentColor;
                    this.context.fillRect(
                        this.playerWidthPos + (x * (GameVariables.halfSprite / 4)),
                        this.playerHeightPos + (y * (GameVariables.halfSprite / 4)),
                        (GameVariables.halfSprite / 4), (GameVariables.halfSprite / 4));
                }
            }
        }

        // Draw Player ansiety bar
        this.context.beginPath();
        this.context.fillStyle = playerAnsietyLevelColors[this.currentAnsietyLevel];
        this.context.fillRect(
            this.playerWidthPos - GameVariables.halfSprite,
            this.playerHeightPos - GameVariables.halfSprite,
            Math.min((this.currentAnsiety * (GameVariables.spriteSize * 2)) / GameVariables.playerMaxAnsiety, GameVariables.spriteSize * 2),
            GameVariables.halfSprite / 2);
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
    [null, null, null, null, null, null, null, null],
    [null, null, null, greenArea, greenArea, null, null, null],
    [null, null, greenArea, greenArea, greenArea, greenArea, null, null],
    [null, null, greenArea, greenArea, greenArea, greenArea, null, null],
    [null, null, null, greenArea, greenArea, null, null, null],
    [null, null, null, null, null, null, null, null],
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
