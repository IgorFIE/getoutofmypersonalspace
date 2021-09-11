const storeId = 'igorfie-get-out-of-my-personal-space-high-score';

const pixelMulpiplier = 5;

const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const gameHalfWidth = Math.round(gameWidth / 2);
const gameHalfHeight = Math.round(gameHeight / 2);

const spriteSize = 32;
const halfSprite = spriteSize / 2;
const oneThirdSprite = spriteSize / 3;
const oneFourthSprite = spriteSize / 4;
const oneEighthSprite = spriteSize / 8;
const oneSixteenthSprite = spriteSize / 16;

const endGameScreenTimer = 4;
const msgDisplayTimer = 4;
const eventMsgDisplayTimer = 8;

const boardSize = 11;
const boardScaleMultiplier = 5;
const boardSpriteSize = spriteSize * boardScaleMultiplier;
const boardRealSize = boardSpriteSize * boardSize;

const playerSpeed = 100;
const playerAnimationSpeed = 12;
const playerAreaLevelSpeed = 30;
const playerSpriteSize = oneFourthSprite * 3;

const enemySpeed = 100;
const enemyAnimationSpeed = 12;
const enemyMinSteps = 30;
const enemyMaxSteps = 120;

const minEnemyNumber = 40;
const levelScoreGap = 5;
const amountOfEnemiesToScale = 10;
const maxEnemyNumber = 160;

let monetizationActive = false;
let playerMaxAnxiety = 250;
let itemReducedAnxietyValue = 30;

export const GameVariables = {
    storeId,
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
    endGameScreenTimer,
    msgDisplayTimer,
    eventMsgDisplayTimer,
    boardSize,
    boardScaleMultiplier,
    boardSpriteSize,
    boardRealSize,
    playerSpeed,
    playerAnimationSpeed,
    playerAreaLevelSpeed,
    playerSpriteSize,
    enemySpeed,
    enemyAnimationSpeed,
    enemyMinSteps,
    enemyMaxSteps,
    minEnemyNumber,
    levelScoreGap,
    amountOfEnemiesToScale,
    maxEnemyNumber,
    monetizationActive,
    playerMaxAnxiety,
    itemReducedAnxietyValue
}