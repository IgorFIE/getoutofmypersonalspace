import { GameVariables } from "../game-variables";
import { SquareObject } from "../objects/square-object";
import { randomNumberOnRange } from "../utilities/util";

export class Enemy {
    constructor(enemyObj) {
        this.enemyObj = enemyObj;
        this.animationCicle = 0;
        this.currentAnimationSprite = 0;

        this.keys = [];
        this.lastMovementKey = '';
        this.stepMovement = 0;
    }

    enemyMovement(board, secondsPassed) {
        this.generateEnemyMovement();

        let newX = this.enemyObj.x;
        let newY = this.enemyObj.y;

        const distance = secondsPassed * GameVariables.playerSpeed;
        if (this.keys['d']) { newX += distance; }
        if (this.keys['a']) { newX -= distance; }
        if (this.keys['w']) { newY -= distance; }
        if (this.keys['s']) { newY += distance; }

        const newEnemyObj = new SquareObject(newX, newY, this.enemyObj.w, this.enemyObj.h);
        if (board.hasCollision(newEnemyObj)) {
            newEnemyObj.x = this.enemyObj.x;
            newEnemyObj.y = this.enemyObj.y;
            this.stepMovement = 0;
        }
        this.enemyObj = newEnemyObj;
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
        const enemyXPosAjustment = this.enemyObj.x - GameVariables.oneFourthSprite;
        const enemyYPosAjustment = this.enemyObj.y + (GameVariables.oneEighthSprite * 2);
        for (let y = 0; y < enemyShadowSprite.length; y++) {
            for (let x = 0; x < enemyShadowSprite[y].length; x++) {
                const currentColor = enemyShadowSprite[y][x];
                if (currentColor) {
                    context.beginPath();
                    context.fillStyle = currentColor;
                    context.fillRect(
                        enemyXPosAjustment + (x * GameVariables.oneEighthSprite),
                        enemyYPosAjustment + (y * GameVariables.oneEighthSprite),
                        GameVariables.oneEighthSprite, GameVariables.oneEighthSprite);
                }
            }
        }
    }

    drawEnemySprite(context) {
        const enemyXPosAjustment = this.enemyObj.x - (GameVariables.oneFourthSprite);
        const enemyYPosAjustment = this.enemyObj.y - GameVariables.halfSprite;
        const spriteToUse = this.spriteToUse();
        for (let y = 0; y < spriteToUse.length; y++) {
            for (let x = 0; x < spriteToUse[y].length; x++) {
                const currentColor = spriteToUse[y][x];
                if (currentColor) {
                    context.beginPath();
                    context.fillStyle = currentColor;
                    context.fillRect(
                        enemyXPosAjustment + (x * GameVariables.oneEighthSprite),
                        enemyYPosAjustment + (y * GameVariables.oneEighthSprite),
                        GameVariables.oneEighthSprite, GameVariables.oneEighthSprite);
                }
            }
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
        return this.enemyObj;
    }

    destroyEnemy() {
        mainDiv.removeChild(this.canvas);
    }
}

const hairColor = '#ffffab';
const black = '#000000';
const skinColor = '#e7c688';
const shirt = '#52804d';
const gloves = '#641f14';
const boots = '#1b1116';
const shadow = 'rgba(0,0,0,0.5)';

const enemyShadowSprite = [
    [null, null, shadow, shadow, shadow, shadow, null, null],
    [null, shadow, shadow, shadow, shadow, shadow, shadow, null],
    [null, null, shadow, shadow, shadow, shadow, null, null],
];

const enemyFrontSprite = [
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, black, skinColor, skinColor, black, hairColor, null],
    [null, skinColor, skinColor, skinColor, skinColor, skinColor, skinColor, null],
    [null, null, skinColor, skinColor, skinColor, skinColor, null, null],
    [null, shirt, shirt, shirt, shirt, shirt, shirt, null],
    [null, gloves, shirt, shirt, shirt, shirt, gloves, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyFrontSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, black, skinColor, skinColor, black, hairColor, null],
    [null, skinColor, skinColor, skinColor, skinColor, skinColor, skinColor, null],
    [null, gloves, skinColor, skinColor, skinColor, skinColor, null, null],
    [null, null, shirt, shirt, shirt, gloves, null, null],
    [null, null, boots, null, null, null, null, null]
];

const enemyFrontSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, black, skinColor, skinColor, black, hairColor, null],
    [null, skinColor, skinColor, skinColor, skinColor, skinColor, skinColor, null],
    [null, null, skinColor, skinColor, skinColor, skinColor, gloves, null],
    [null, null, gloves, shirt, shirt, shirt, null, null],
    [null, null, null, null, null, boots, null, null]
];

const enemyBackSprite = [
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, hairColor, hairColor, hairColor, hairColor, skinColor, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, shirt, shirt, shirt, shirt, shirt, shirt, null],
    [null, gloves, shirt, shirt, shirt, shirt, gloves, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyBackSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, hairColor, hairColor, hairColor, hairColor, skinColor, null],
    [null, shirt, hairColor, hairColor, hairColor, hairColor, gloves, null],
    [null, gloves, shirt, shirt, shirt, shirt, null, null],
    [null, null, null, null, null, boots, null, null]
];

const enemyBackSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, hairColor, hairColor, hairColor, hairColor, skinColor, null],
    [null, gloves, hairColor, hairColor, hairColor, hairColor, shirt, null],
    [null, null, shirt, shirt, shirt, shirt, gloves, null],
    [null, null, boots, null, null, null, null, null]
];

const enemyRightSprite = [
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, skinColor, black, skinColor, null],
    [null, hairColor, hairColor, hairColor, skinColor, skinColor, skinColor, null],
    [null, null, hairColor, skinColor, skinColor, skinColor, skinColor, null],
    [null, null, shirt, shirt, shirt, shirt, null, null],
    [null, null, shirt, gloves, gloves, shirt, null, null],
    [null, null, null, boots, boots, null, null, null]
];

const enemyRightSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, skinColor, black, skinColor, null],
    [null, hairColor, hairColor, hairColor, skinColor, skinColor, skinColor, null],
    [null, null, hairColor, skinColor, skinColor, skinColor, skinColor, null],
    [null, null, gloves, shirt, shirt, shirt, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyRightSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, hairColor, hairColor, hairColor, skinColor, black, skinColor, null],
    [null, hairColor, hairColor, hairColor, skinColor, skinColor, skinColor, null],
    [null, null, hairColor, skinColor, skinColor, skinColor, skinColor, null],
    [null, null, shirt, shirt, shirt, gloves, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyLeftSprite = [
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, black, skinColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, skinColor, skinColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, skinColor, skinColor, skinColor, hairColor, null, null],
    [null, null, shirt, shirt, shirt, shirt, null, null],
    [null, null, shirt, gloves, gloves, shirt, null, null],
    [null, null, null, boots, boots, null, null, null]
];

const enemyLeftSpriteWalk1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, black, skinColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, skinColor, skinColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, skinColor, skinColor, skinColor, hairColor, null, null],
    [null, null, shirt, shirt, shirt, gloves, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyLeftSpriteWalk2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, hairColor, hairColor, hairColor, hairColor, null, null],
    [null, hairColor, hairColor, hairColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, black, skinColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, skinColor, skinColor, hairColor, hairColor, hairColor, null],
    [null, skinColor, skinColor, skinColor, skinColor, hairColor, null, null],
    [null, null, gloves, shirt, shirt, shirt, null, null],
    [null, null, boots, null, null, boots, null, null]
];

const enemyFrontWalkingCicle = [enemyFrontSpriteWalk1, enemyFrontSprite, enemyFrontSpriteWalk2, enemyFrontSprite];
const enemyBackWalkingCicle = [enemyBackSpriteWalk1, enemyBackSprite, enemyBackSpriteWalk2, enemyBackSprite];
const enemyRightWalkingCicle = [enemyRightSpriteWalk1, enemyRightSprite, enemyRightSpriteWalk2, enemyRightSprite];
const enemyLeftWalkingCicle = [enemyLeftSpriteWalk1, enemyLeftSprite, enemyLeftSpriteWalk2, enemyLeftSprite];
