import { GameVariables } from "../game-variables";
import { SquareObject } from "../objects/square-object";
import { randomNumberOnRange } from "../utilities/util";

export class Enemy {
    constructor(enemyObj) {
        this.enemyRect = new SquareObject(enemyObj.x, enemyObj.y, GameVariables.spriteSize, GameVariables.spriteSize);
        this.fakeMovementRect = new SquareObject(0, 0, GameVariables.spriteSize, GameVariables.spriteSize);
        this.animationCicle = 0;
        this.currentAnimationSprite = 0;

        this.hairColor = hairColors[randomNumberOnRange(0, hairColors.length - 1)];
        this.skinColor = skinColors[randomNumberOnRange(0, skinColors.length - 1)];
        this.shirtColor = shirtColors[randomNumberOnRange(0, shirtColors.length - 1)];

        this.keys = [];
        this.lastMovementKey = '';
        this.stepMovement = 0;
    }

    enemyMovement(board, secondsPassed) {
        this.generateEnemyMovement();

        let newX = this.enemyRect.x;
        let newY = this.enemyRect.y;

        const distance = secondsPassed * GameVariables.playerSpeed;
        if (this.keys['d']) { newX += distance; }
        if (this.keys['a']) { newX -= distance; }
        if (this.keys['w']) { newY -= distance; }
        if (this.keys['s']) { newY += distance; }

        this.fakeMovementRect.x = newX;
        this.fakeMovementRect.y = newY;

        if (board.hasCollision(this.fakeMovementRect)) {
            newX = this.enemyRect.x;
            newY = this.enemyRect.y;
            this.stepMovement = 0;
        }
        this.enemyRect.x = newX;
        this.enemyRect.y = newY;
    }

    generateEnemyMovement() {
        if (this.stepMovement > 0) {
            this.stepMovement--;
            this.keys[this.lastMovementKey] = true;
        } else {
            this.keys[this.lastMovementKey] = false;
            this.stepMovement = randomNumberOnRange(GameVariables.enemyMinSteps, GameVariables.enemyMaxSteps);
            switch (randomNumberOnRange(0, 3)) {
                case 0:
                    this.lastMovementKey = 'd';
                    break;
                case 1:
                    this.lastMovementKey = 'a';
                    break;
                case 2:
                    this.lastMovementKey = 'w';
                    break;
                case 3:
                    this.lastMovementKey = 's';
                    break;
                default:
                    break;
            }
            this.keys[this.lastMovementKey] = true;
        }
    }

    drawEnemy(context) {
        this.drawEnemyShadow(context);
        this.drawEnemySprite(context);
    }

    drawEnemyShadow(context) {
        const playerYPosAjustment = this.enemyRect.y + (GameVariables.oneFourthSprite * 3);
        for (let y = 0; y < enemyShadowSprite.length; y++) {
            for (let x = 0; x < enemyShadowSprite[y].length; x++) {
                const currentColor = enemyShadowSprite[y][x];
                if (currentColor) {
                    context.beginPath();
                    context.fillStyle = currentColor;
                    context.fillRect(
                        Math.round(this.enemyRect.x + (x * GameVariables.oneEighthSprite)),
                        Math.round(playerYPosAjustment + (y * GameVariables.oneEighthSprite)),
                        GameVariables.oneEighthSprite, GameVariables.oneEighthSprite);
                }
            }
        }
    }

    drawEnemySprite(context) {
        const spriteToUse = this.spriteToUse();
        for (let y = 0; y < spriteToUse.length; y++) {
            for (let x = 0; x < spriteToUse[y].length; x++) {
                const currentColor = this.getEnemySpecificColorById(spriteToUse[y][x]);
                if (currentColor) {
                    context.beginPath();
                    context.fillStyle = currentColor;
                    context.fillRect(
                        Math.round(this.enemyRect.x + (x * GameVariables.oneEighthSprite)),
                        Math.round(this.enemyRect.y + (y * GameVariables.oneEighthSprite)),
                        GameVariables.oneEighthSprite, GameVariables.oneEighthSprite);
                }
            }
        }
    }

    getEnemySpecificColorById(currentColor) {
        switch (currentColor) {
            case hairId:
                return this.hairColor;
            case skinId:
                return this.skinColor;
            case shirtId:
                return this.shirtColor;
            default:
                return currentColor;
        }
    }

    spriteToUse() {
        this.animationCicle++;
        if (this.animationCicle === GameVariables.enemyAnimationSpeed) {
            this.currentAnimationSprite = this.currentAnimationSprite === enemyFrontWalkingCicle.length - 1 ? 0 : this.currentAnimationSprite + 1;
            this.animationCicle = 0;
        }
        if (this.keys['d']) { return enemyRightWalkingCicle[this.currentAnimationSprite]; }
        if (this.keys['a']) { return enemyLeftWalkingCicle[this.currentAnimationSprite]; }
        if (this.keys['w']) { return enemyBackWalkingCicle[this.currentAnimationSprite]; }
        if (this.keys['s']) { return enemyFrontWalkingCicle[this.currentAnimationSprite]; }
        return enemyFrontSprite;
    }

    getEnemyObj() {
        return this.enemyRect;
    }
}

const hairColors = ['#ffffab', '#cd9722', '#999a9e', '#1b1116', '#6e5e40', '#9e6800'];
const shirtColors = ['#52804d', '#10495e', '#354a5c', '#3c4f68', '#a80000', '#ffff57'];
const skinColors = ['#e7c688', '#ffffab', '#edeef7', '#843d0d', '#38252e', '#703a33'];

const hairId = 'hairId';
const black = '#000000';
const skinId = 'skinId';
const shirtId = 'shirtId';
const gloves = '#641f14';
const boots = '#1b1116';
const shadow = 'rgba(0,0,0,0.5)';

const enemyShadowSprite = [
    [null, null, shadow, shadow, shadow, shadow, null, null],
    [null, shadow, shadow, shadow, shadow, shadow, shadow, null],
    [null, null, shadow, shadow, shadow, shadow, null, null],
];

const enemyFrontSprite = [
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, hairId, black, skinId, skinId, black, hairId, null],
    [null, skinId, skinId, skinId, skinId, skinId, skinId, null],
    [null, null, skinId, skinId, skinId, skinId, null, null],
    [null, shirtId, shirtId, shirtId, shirtId, shirtId, shirtId, null],
    [null, gloves, shirtId, shirtId, shirtId, shirtId, gloves, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyFrontSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, hairId, black, skinId, skinId, black, hairId, null],
    [null, skinId, skinId, skinId, skinId, skinId, skinId, null],
    [null, gloves, skinId, skinId, skinId, skinId, null, null],
    [null, null, shirtId, shirtId, shirtId, gloves, null, null],
    [null, null, boots, null, null, null, null, null]
];

const enemyFrontSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, hairId, black, skinId, skinId, black, hairId, null],
    [null, skinId, skinId, skinId, skinId, skinId, skinId, null],
    [null, null, skinId, skinId, skinId, skinId, gloves, null],
    [null, null, gloves, shirtId, shirtId, shirtId, null, null],
    [null, null, null, null, null, boots, null, null]
];

const enemyBackSprite = [
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, skinId, hairId, hairId, hairId, hairId, skinId, null],
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, shirtId, shirtId, shirtId, shirtId, shirtId, shirtId, null],
    [null, gloves, shirtId, shirtId, shirtId, shirtId, gloves, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyBackSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, skinId, hairId, hairId, hairId, hairId, skinId, null],
    [null, shirtId, hairId, hairId, hairId, hairId, gloves, null],
    [null, gloves, shirtId, shirtId, shirtId, shirtId, null, null],
    [null, null, null, null, null, boots, null, null]
];

const enemyBackSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, skinId, hairId, hairId, hairId, hairId, skinId, null],
    [null, gloves, hairId, hairId, hairId, hairId, shirtId, null],
    [null, null, shirtId, shirtId, shirtId, shirtId, gloves, null],
    [null, null, boots, null, null, null, null, null]
];

const enemyRightSprite = [
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, hairId, hairId, hairId, skinId, black, skinId, null],
    [null, hairId, hairId, hairId, skinId, skinId, skinId, null],
    [null, null, hairId, skinId, skinId, skinId, skinId, null],
    [null, null, shirtId, shirtId, shirtId, shirtId, null, null],
    [null, null, shirtId, gloves, gloves, shirtId, null, null],
    [null, null, null, boots, boots, null, null, null]
];

const enemyRightSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, hairId, hairId, hairId, skinId, black, skinId, null],
    [null, hairId, hairId, hairId, skinId, skinId, skinId, null],
    [null, null, hairId, skinId, skinId, skinId, skinId, null],
    [null, null, gloves, shirtId, shirtId, shirtId, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyRightSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, hairId, hairId, hairId, skinId, black, skinId, null],
    [null, hairId, hairId, hairId, skinId, skinId, skinId, null],
    [null, null, hairId, skinId, skinId, skinId, skinId, null],
    [null, null, shirtId, shirtId, shirtId, gloves, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyLeftSprite = [
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, skinId, black, skinId, hairId, hairId, hairId, null],
    [null, skinId, skinId, skinId, hairId, hairId, hairId, null],
    [null, skinId, skinId, skinId, skinId, hairId, null, null],
    [null, null, shirtId, shirtId, shirtId, shirtId, null, null],
    [null, null, shirtId, gloves, gloves, shirtId, null, null],
    [null, null, null, boots, boots, null, null, null]
];

const enemyLeftSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, skinId, black, skinId, hairId, hairId, hairId, null],
    [null, skinId, skinId, skinId, hairId, hairId, hairId, null],
    [null, skinId, skinId, skinId, skinId, hairId, null, null],
    [null, null, shirtId, shirtId, shirtId, gloves, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyLeftSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairId, hairId, hairId, hairId, null, null],
    [null, hairId, hairId, hairId, hairId, hairId, hairId, null],
    [null, skinId, black, skinId, hairId, hairId, hairId, null],
    [null, skinId, skinId, skinId, hairId, hairId, hairId, null],
    [null, skinId, skinId, skinId, skinId, hairId, null, null],
    [null, null, gloves, shirtId, shirtId, shirtId, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyFrontWalkingCicle = [enemyFrontSpriteWalk1, enemyFrontSprite, enemyFrontSpriteWalk2, enemyFrontSprite];
const enemyBackWalkingCicle = [enemyBackSpriteWalk1, enemyBackSprite, enemyBackSpriteWalk2, enemyBackSprite];
const enemyRightWalkingCicle = [enemyRightSpriteWalk1, enemyRightSprite, enemyRightSpriteWalk2, enemyRightSprite];
const enemyLeftWalkingCicle = [enemyLeftSpriteWalk1, enemyLeftSprite, enemyLeftSpriteWalk2, enemyLeftSprite];
