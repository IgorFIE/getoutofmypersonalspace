import { Board } from "./entities/board";
import { Player } from "./entities/player";
import { GameVariables, PIXEL_MULTIPLIER } from "./game-variables";
import { SquareObject } from "./objects/square-object";
import { CircleObject } from "./objects/circle-object";
import { Minimap } from "./entities/minimap";
import { Item } from "./entities/item";
import { ScoreBoard } from "./entities/score-board";
import { Enemy } from "./entities/enemy";
import { rectCircleCollision, rectCollision } from "./utilities/collision-utilities";

let mainDiv;
let board;
let minimap;
let player;
let item;
let keys = [];

let secondsPassed;
let oldTimeStamp;

let fps;
let scoreBoard;

let isGameOver;

let enemies = [];
let ememyCanvas;
let ememyContext;

function init() {
    mainDiv = document.getElementById('main');
    mainDiv.style.width = GameVariables.gameWidth + 'px';
    mainDiv.style.height = GameVariables.gameHeight + 'px';

    board = new Board(mainDiv);
    board.initBoard();

    ememyCanvas = document.createElement('canvas');
    const spriteWithMultiplier = GameVariables.spriteSize * GameVariables.boardScaleMultiplier;
    ememyCanvas.width = GameVariables.boardSize * spriteWithMultiplier;
    ememyCanvas.height = GameVariables.boardSize * spriteWithMultiplier;
    mainDiv.appendChild(ememyCanvas);

    ememyContext = ememyCanvas.getContext('2d');
    ememyContext.imageSmoothingEnabled = false;

    minimap = new Minimap(board.getBoard(), mainDiv);

    item = new Item(mainDiv);
    item.generateNewItem({ x: 5, y: 5 });

    scoreBoard = new ScoreBoard(mainDiv);

    player = new Player(mainDiv);
    player.drawPlayer();
    addPlayerEvents();

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);
    const fpsElem = document.getElementById('fps');
    fpsElem.innerHTML = fps + 's';

    isGameOver = player.getPlayerAnsiety() >= GameVariables.playerMaxAnsiety;
    
    if(isGameOver){
        console.log('GAME OVER!!!');
    } else {
        update();
        clean();
        draw();
    }

    window.requestAnimationFrame(gameLoop);
}

function update() {
    generateEnemy();
    enemies.forEach((it) => it.enemyMovement(board, secondsPassed));
    playerMovement();
    const playerObj = player.getPlayerObj();
    board.updateBoard(playerObj.x, playerObj.y);
    item.updateItem(playerObj.x, playerObj.y);
    player.upgradePlayer();
    ememyCanvas.style.transform = 'translate(' + playerObj.x + 'px, ' + playerObj.y + 'px)';
}

function playerMovement() {
    const playerBoardObj = player.getPlayerBoardObj();
    const playerObj = player.getPlayerObj();
    let newX = playerObj.x;
    let newY = playerObj.y;

    const isMultiDirection = keys ? Object.keys(keys).filter((key) => (key == 'd' || key == 'a' || key == 'w' || key == 's') && keys[key]).length > 1 : false;
    const distance = isMultiDirection ? (secondsPassed * GameVariables.playerSpeed) / 1.4142 : secondsPassed * GameVariables.playerSpeed;

    if (keys['d']) { newX -= distance; }
    if (keys['a']) { newX += distance; }
    if (keys['w']) { newY += distance; }
    if (keys['s']) { newY -= distance; }

    const playerBoardX = Math.abs(newX - (GameVariables.gameWidth / 2));
    const playerBoardY = Math.abs(newY - (GameVariables.gameHeight / 2));

    const newPlayerObj = new SquareObject(playerBoardX - GameVariables.halfSprite, playerBoardY + (GameVariables.halfSprite / 4), playerObj.w, playerObj.h);
    const newPlayerArea = new CircleObject(playerBoardX, playerBoardY + (GameVariables.halfSprite - GameVariables.halfSprite / 4), player.getPlayerArea().r);

    if (board.hasCollision(newPlayerObj)) {
        newX = playerObj.x;
        newY = playerObj.y;
        newPlayerObj.x = playerBoardObj.x;
        newPlayerObj.y = playerBoardObj.y;
    }

    const playerXYBoardPos = board.getBoardXYPosition(newPlayerArea);
    if (item.hasCollision(newPlayerObj)) {
        item.generateNewItem(playerXYBoardPos);
        scoreBoard.updateScore();
    }
    minimap.drawMinimap(playerXYBoardPos.x, playerXYBoardPos.y, item.getItemBoardPosX, item.getItemBoardPosY);

    player.setCollisionInArea(hasEnemyInPlayerArea(newPlayerArea));

    playerObj.x = newX;
    playerObj.y = newY;
    playerBoardObj.x = newPlayerObj.x;
    playerBoardObj.y = newPlayerObj.y;
}

function clean() {
    player.cleanPlayer();
    ememyContext.clearRect(0, 0, ememyCanvas.width, ememyCanvas.height);
}

function draw() {
    player.drawPlayer(keys);
    enemies.forEach((it) => it.drawEnemy(ememyContext));
}

function generateEnemy() {
    if (enemies.length < GameVariables.enemyNumber) {
        const boardSpriteSize = GameVariables.spriteSize * GameVariables.boardScaleMultiplier;
        const newEnemyObj = new SquareObject(generateRandomPositionInsideBoard(), generateRandomPositionInsideBoard(), GameVariables.spriteSize, GameVariables.spriteSize);
        const hasBoardCollision = board.hasCollision(newEnemyObj);
        const hasEnemyCollision = !!enemies.find((it) => rectCollision(it.getEnemyObj(), newEnemyObj));

        // need to check this afterwards
        const hasPlayerCollision = rectCollision(new SquareObject(
            player.getPlayerBoardObj().x - boardSpriteSize,
            player.getPlayerBoardObj().y - boardSpriteSize,
            boardSpriteSize * 2,
            boardSpriteSize * 3
        ), newEnemyObj);

        if (!hasBoardCollision && !hasEnemyCollision && !hasPlayerCollision) {
            enemies.push(new Enemy(newEnemyObj, mainDiv));
        }
    }
}

function hasEnemyInPlayerArea(movingObject) {
    return !!enemies.find((it) => rectCircleCollision(movingObject, it.getEnemyObj()));
}

function generateRandomPositionInsideBoard() {
    const boardSpriteSize = GameVariables.spriteSize * GameVariables.boardScaleMultiplier;
    const min = boardSpriteSize + PIXEL_MULTIPLIER;
    const max = (boardSpriteSize * GameVariables.boardSize) - boardSpriteSize + PIXEL_MULTIPLIER;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addPlayerEvents() {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
}

function removePlayerEvents() {
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('keyup', keyUp);
}

function keyDown(e) {
    keys[e.key] = true;
}

function keyUp(e) {
    keys[e.key] = false;
}

function destroy() {
    mainDiv.innerHTML = '';
    removePlayerEvents();
}

init();