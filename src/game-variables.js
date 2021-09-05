const pixelMulpiplier = 5;

const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const gameHalfWidth = Math.floor(gameWidth / 2);
const gameHalfHeight = Math.floor(gameHeight / 2);

const spriteSize = 32 * pixelMulpiplier;
const halfSprite = spriteSize / 2;
const oneThirdSprite = spriteSize / 3;
const oneFourthSprite = spriteSize / 4;
const oneEighthSprite = spriteSize / 8;
const oneSixteenthSprite = spriteSize / 16;

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
const playerMaxAnxiety = 250;

const enemySpeed = 500;
const enemyAnimationSpeed = 12;
const enemyNumber = 80;
const enemyMinSteps = 30;
const enemyMaxSteps = 120;

export const GameVariables = {
    pixelMulpiplier,
    gameWidth,
    gameHeight,
    gameHalfWidth,
    gameHalfHeight,
    spriteSize,
    halfSprite,
    oneThirdSprite,
    oneFourthSprite,
    oneEighthSprite,
    oneSixteenthSprite,
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
    playerMaxAnxiety,
    enemySpeed,
    enemyAnimationSpeed,
    enemyNumber,
    enemyMinSteps,
    enemyMaxSteps
}