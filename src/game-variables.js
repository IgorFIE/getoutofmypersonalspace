const pixelMulpiplier = 5;

const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const spriteSize = 32 * pixelMulpiplier;
const halfSprite = 16 * pixelMulpiplier;

const originalSpriteSize = spriteSize / pixelMulpiplier;
const originalHalfSprite = halfSprite / pixelMulpiplier;

const endGameScreenTimer = 4;

const boardSize = 11;
const boardScaleMultiplier = 5;
const boardSpriteSize = spriteSize * boardScaleMultiplier;
const boardRealSize = boardSpriteSize * boardSize;

const playerSpeed = 500;
const playerAnimationSpeed = 12;
const playerAreaLevelSpeed = 30;
const playerMaxAnsiety = 250;

const enemySpeed = 500;
const enemyAnimationSpeed = 12;
const enemyNumber = 80;

export const GameVariables = {
    pixelMulpiplier,
    gameWidth,
    gameHeight,
    spriteSize,
    halfSprite,
    originalSpriteSize,
    originalHalfSprite,
    endGameScreenTimer,
    boardSize,
    boardScaleMultiplier,
    boardSpriteSize,
    boardRealSize,
    playerSpeed,
    playerAnimationSpeed,
    playerAreaLevelSpeed,
    playerMaxAnsiety,
    enemySpeed,
    enemyAnimationSpeed,
    enemyNumber
}