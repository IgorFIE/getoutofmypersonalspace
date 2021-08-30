import { GameVariables } from "./game-variables";

export class Enemy {
    constructor(enemyObj) {
        this.enemyObj = enemyObj;
        this.animationCicle = 0;
        this.currentAnimationSprite = 0;
        this.keys = [];
    }

    getEnemyObj() {
        return this.enemyObj;
    }

    updateEnemy(x, y) {
        this.canvas.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

    generateEnemyMovement() {

    }

    drawEnemy(context) {
        // Draw Enemy Shadow
        for (let y = 0; y < enemyShadowSprite.length; y++) {
            for (let x = 0; x < enemyShadowSprite[y].length; x++) {
                const currentColor = enemyShadowSprite[y][x];
                if (currentColor) {
                    context.beginPath();
                    context.fillStyle = currentColor;
                    context.fillRect(
                        this.enemyObj.x + (x * (GameVariables.halfSprite / 4)),
                        (GameVariables.spriteSize - GameVariables.spriteSize / 4) + this.enemyObj.y + (y * (GameVariables.halfSprite / 4)),
                        (GameVariables.halfSprite / 4), (GameVariables.halfSprite / 4));
                }
            }
        }

        // Draw Enemy
        const spriteToUse = this.spriteToUse();
        for (let y = 0; y < spriteToUse.length; y++) {
            for (let x = 0; x < spriteToUse[y].length; x++) {
                const currentColor = spriteToUse[y][x];
                if (currentColor) {
                    context.beginPath();
                    context.fillStyle = currentColor;
                    context.fillRect(
                        this.enemyObj.x + (x * (GameVariables.halfSprite / 4)),
                        this.enemyObj.y + (y * (GameVariables.halfSprite / 4)),
                        (GameVariables.halfSprite / 4), (GameVariables.halfSprite / 4));
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
