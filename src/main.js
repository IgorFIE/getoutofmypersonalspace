const { Game } = require("./game");
const { GameVariables, PIXEL_MULTIPLIER } = require("./game-variables");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("./utilities/text");

let fpsElem;
let mainDiv;
let mainMenuScreen;
let gameDiv;
let gameOverScreen;

let isGameRunning = false;
let game;
let keys = [];

let secondsPassed;
let oldTimeStamp;
let endGameTimer;

function init() {
    mainDiv = document.getElementById('main');
    fpsElem = document.getElementById('fps');

    gameDiv = document.createElement('div');
    gameDiv.id = 'gameDiv';
    mainDiv.appendChild(gameDiv);

    createMainMenuScreen(mainDiv);
    createGameOverScreen(mainDiv);
    hideGameOverScreen();

    addKeyListenerEvents();
    window.requestAnimationFrame(mainLoop);
}

function mainLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    fpsElem.innerHTML = Math.round(1 / secondsPassed) + 's';
    if (isGameRunning) {
        game.gameLoop(secondsPassed, keys);
        if (game.isGameOver()) {
            showGameOverScreen();
            handleGameOverInput();
            endGameTimer += secondsPassed;
            if (endGameTimer > GameVariables.endGameScreenTimer) {
                destroyGameAndLoadMainMenu();
            }
        }
    } else {
        handleStartGameInput();
    }
    window.requestAnimationFrame(mainLoop);
}

function destroyGameAndLoadMainMenu() {
    game.destroy();
    game = null;
    hideGameOverScreen();
    showMainMenuScreen();
}

function handleStartGameInput() {
    if (keys['Enter']) {
        keys['Enter'] = false;
        hideMainMenuScreen();
    }
}

function handleGameOverInput() {
    if (keys['Enter']) {
        keys['Enter'] = false;
        destroyGameAndLoadMainMenu();
    }
}

function addKeyListenerEvents() {
    window.addEventListener('keydown', function (e) {
        keys[e.key] = true;
    });
    window.addEventListener('keyup', function (e) {
        keys[e.key] = false;
    });
}

function createNewGame() {
    endGameTimer = 0;
    game = new Game();
    game.init(gameDiv);
}

function createMainMenuScreen(mainDiv) {
    mainMenuScreen = document.createElement('canvas');
    mainMenuScreen.id = 'mainMenu';
    mainMenuScreen.width = GameVariables.gameWidth;
    mainMenuScreen.height = GameVariables.gameHeight;
    mainDiv.appendChild(mainMenuScreen);

    const mainMenuContext = mainMenuScreen.getContext('2d');
    mainMenuContext.imageSmoothingEnabled = false;

    const mainMenuTitleAsPixels = convertTextToPixelArt('Get out of my personal space');
    const mainMenuPixelSize = PIXEL_MULTIPLIER * 2;
    drawPixelTextInCanvasContext(mainMenuTitleAsPixels, mainMenuScreen, mainMenuPixelSize, (mainMenuScreen.height / 3));

    const controlsMessageAsPixels = convertTextToPixelArt('wasd to move player');
    drawPixelTextInCanvasContext(controlsMessageAsPixels, mainMenuScreen, PIXEL_MULTIPLIER, (mainMenuScreen.height / 2) + (mainMenuScreen.height / 5));

    const startMessageAsPixels = convertTextToPixelArt('press enter to start the game');
    drawPixelTextInCanvasContext(startMessageAsPixels, mainMenuScreen, PIXEL_MULTIPLIER, (mainMenuScreen.height / 2) + (mainMenuScreen.height / 4));

    const createdByMessageAsPixels = convertTextToPixelArt('a game by igor estevao   js13kgames 2021');
    drawPixelTextInCanvasContext(createdByMessageAsPixels, mainMenuScreen, PIXEL_MULTIPLIER / 2, mainMenuScreen.height - 28 - (PIXEL_MULTIPLIER * 2));

    createNewGame();
}

function showMainMenuScreen() {
    isGameRunning = false;
    createNewGame();
    mainMenuScreen.classList.remove('hidden');
}

function hideMainMenuScreen() {
    isGameRunning = true;
    mainMenuScreen.classList.add('hidden');
}

function createGameOverScreen(mainDiv) {
    gameOverScreen = document.createElement('canvas');
    gameOverScreen.id = 'gameOver';
    gameOverScreen.width = GameVariables.gameWidth;
    gameOverScreen.height = GameVariables.gameHeight;
    mainDiv.appendChild(gameOverScreen);

    const gameOverContext = gameOverScreen.getContext('2d');
    gameOverContext.imageSmoothingEnabled = false;
    gameOverContext.beginPath();
    gameOverContext.fillStyle = 'rgba(255,0,255,0.2)';
    gameOverContext.fillRect(0, 0, GameVariables.gameWidth, GameVariables.gameHeight);

    const gameOverAsPixels = convertTextToPixelArt('game over');
    const gameOverPixeltSize = PIXEL_MULTIPLIER * 4;
    drawPixelTextInCanvasContext(gameOverAsPixels, gameOverScreen, gameOverPixeltSize, (gameOverScreen.height / 3));

    const anxietyMessageAsPixels = convertTextToPixelArt('your anxiety is to high');
    drawPixelTextInCanvasContext(anxietyMessageAsPixels, gameOverScreen, PIXEL_MULTIPLIER, (mainMenuScreen.height / 2) + (mainMenuScreen.height / 5));
}

function showGameOverScreen() {
    gameOverScreen.classList.remove('hidden');
}

function hideGameOverScreen() {
    gameOverScreen.classList.add('hidden');
}

init();