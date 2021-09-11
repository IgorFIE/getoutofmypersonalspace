const { Game } = require("./game");
const { GameVariables } = require("./game-variables");
const { Sound } = require("./utilities/sound");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("./utilities/text");

let mainDiv;
let mainMenuCanvas;

let gameDiv;
let gameOverCanvas;

let sound;
let isGameOverFirstLoopProcessed = false;

let highScore = parseInt(localStorage.getItem(GameVariables.storeId)) || 0;

let isGameRunning = false;
let game;
let keys = [];

let secondsPassed;
let oldTimeStamp;
let endGameTimer;

function init() {
    mainDiv = document.getElementById('main');

    gameDiv = document.createElement('div');
    gameDiv.id = 'gameDiv';
    mainDiv.appendChild(gameDiv);

    sound = new Sound();

    createMainMenuScreen(mainDiv);
    createGameOverScreen(mainDiv);
    hideGameOverScreen();

    addKeyListenerEvents();
    addMonetizationEvent();
    window.requestAnimationFrame(mainLoop);
}

function mainLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    if (isGameRunning) {
        game.gameLoop(secondsPassed, keys);
        if (game.isGameOver()) {
            if (!isGameOverFirstLoopProcessed) {
                showGameOverScreen();
                sound.playGameOverSound();
                sound.stopInAreaSound();
                updateHighScore();
                isGameOverFirstLoopProcessed = true;
            }
            endGameTimer += secondsPassed;
            if (endGameTimer > GameVariables.endGameScreenTimer) {
                destroyGameAndLoadMainMenu();
            } else {
                handleSkipMenuInput(destroyGameAndLoadMainMenu);
            }
        } else {
            sound.playHumanMusic();
        }
    } else {
        sound.playHumanMusic();
        handleSkipMenuInput(hideMainMenuScreen);
    }
    handleMuteInput();
    window.requestAnimationFrame(mainLoop);
}

function updateHighScore() {
    if (highScore < game.getGameScore()) {
        highScore = game.getGameScore();
        localStorage.setItem(GameVariables.storeId, highScore);
    }
}

function destroyGameAndLoadMainMenu() {
    game.destroy();
    game = null;
    hideGameOverScreen();
    showMainMenuScreen();
}

function handleSkipMenuInput(menuToSkipFn) {
    if (keys['Enter']) {
        keys['Enter'] = false;
        menuToSkipFn();
    }
}

function handleMuteInput() {
    if (keys['m']) {
        keys['m'] = false;
        sound.muteMusic();
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

function addMonetizationEvent() {
    if (document.monetization) {
        document.monetization.addEventListener('monetizationstart', function () {
            GameVariables.monetizationActive = true;
            GameVariables.playerMaxAnxiety = 350;
            GameVariables.itemReducedAnxietyValue = 80;
        });
    }
}

function createNewGame() {
    endGameTimer = 0;
    isGameOverFirstLoopProcessed = false;
    game = new Game(gameDiv, sound, highScore);
}

function createMainMenuScreen(mainDiv) {
    mainMenuCanvas = document.createElement('canvas');
    mainMenuCanvas.id = 'mainMenu';
    mainMenuCanvas.width = GameVariables.gameWidth;
    mainMenuCanvas.height = GameVariables.gameHeight;
    mainDiv.appendChild(mainMenuCanvas);

    const mainMenuContext = mainMenuCanvas.getContext('2d');
    mainMenuContext.imageSmoothingEnabled = false;

    const mainMenuTitleAsPixels = convertTextToPixelArt('Get out of my personal space');
    drawPixelTextInCanvasContext(mainMenuTitleAsPixels, mainMenuCanvas, GameVariables.pixelMulpiplier * 2, (mainMenuCanvas.height / 4));

    const controlsMessageAsPixels = convertTextToPixelArt('wasd to move player');
    drawPixelTextInCanvasContext(controlsMessageAsPixels, mainMenuCanvas, GameVariables.pixelMulpiplier, (mainMenuCanvas.height / 2) + (mainMenuCanvas.height / 5));

    const startMessageAsPixels = convertTextToPixelArt('press enter to start the game');
    drawPixelTextInCanvasContext(startMessageAsPixels, mainMenuCanvas, GameVariables.pixelMulpiplier, (mainMenuCanvas.height / 2) + (mainMenuCanvas.height / 4));

    const soundMessageAsPixels = convertTextToPixelArt('m to mute sound');
    drawPixelTextInCanvasContext(soundMessageAsPixels, mainMenuCanvas, GameVariables.pixelMulpiplier, mainMenuCanvas.height - 76 - (GameVariables.pixelMulpiplier));

    const createdByMessageAsPixels = convertTextToPixelArt('a game by igor estevao   js13kgames 2021');
    drawPixelTextInCanvasContext(createdByMessageAsPixels, mainMenuCanvas, Math.ceil(GameVariables.pixelMulpiplier / 2), mainMenuCanvas.height - 28 - (GameVariables.pixelMulpiplier * 2));

    createNewGame();
}

function showMainMenuScreen() {
    isGameRunning = false;
    createNewGame();
    mainMenuCanvas.classList.remove('hidden');
}

function hideMainMenuScreen() {
    isGameRunning = true;
    game.initGameScoreBoard();
    mainMenuCanvas.classList.add('hidden');
}

function createGameOverScreen(mainDiv) {
    gameOverCanvas = document.createElement('canvas');
    gameOverCanvas.id = 'gameOver';
    gameOverCanvas.width = GameVariables.gameWidth;
    gameOverCanvas.height = GameVariables.gameHeight;
    mainDiv.appendChild(gameOverCanvas);

    const gameOverContext = gameOverCanvas.getContext('2d');
    gameOverContext.imageSmoothingEnabled = false;
    gameOverContext.beginPath();
    gameOverContext.fillStyle = 'rgba(255,0,255,0.2)';
    gameOverContext.fillRect(0, 0, GameVariables.gameWidth, GameVariables.gameHeight);

    const gameOverAsPixels = convertTextToPixelArt('game over');
    drawPixelTextInCanvasContext(gameOverAsPixels, gameOverCanvas, GameVariables.pixelMulpiplier * 4, (gameOverCanvas.height / 3));

    const anxietyMessageAsPixels = convertTextToPixelArt('your anxiety is too high');
    drawPixelTextInCanvasContext(anxietyMessageAsPixels, gameOverCanvas, GameVariables.pixelMulpiplier, (mainMenuCanvas.height / 2) + (mainMenuCanvas.height / 5));
}

function showGameOverScreen() {
    gameOverCanvas.classList.remove('hidden');
}

function hideGameOverScreen() {
    gameOverCanvas.classList.add('hidden');
}

init();