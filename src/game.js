import { Board } from "./board";
import { Player } from "./player";
import { GameVariables } from "./game-variables";
import { SquareObject } from "./square-object";
import { CircleObject } from "./circle-object";
import { Minimap } from "./minimap";

let mainDiv;
let board;
let minimap;
let player;
let keys = [];
let secondsPassed;
let oldTimeStamp;
let fps;

window.onload = init;

function init() {
    mainDiv = document.getElementById('main');
    mainDiv.style.width = GameVariables.gameWidth + 'px';
    mainDiv.style.height = GameVariables.gameHeight + 'px';

    board = new Board(mainDiv);
    board.initBoard();

    minimap = new Minimap(board.getBoard());
    minimap.updateMinimap();

    player = new Player(mainDiv);
    const playerObj = player.getPlayerObj();
    player.drawPlayer();
    playerEvents();

    window.requestAnimationFrame(gameLoop);
}

function playerEvents() {
    window.addEventListener('keydown', function (e) {
        keys[e.key] = true;
    })
    window.addEventListener('keyup', function (e) {
        keys[e.key] = false;
    })
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);
    const fpsElem = document.getElementById('fps');
    fpsElem.innerHTML = fps + 's';

    update();
    clean();
    draw();

    window.requestAnimationFrame(gameLoop);
}

function update() {
    playerMovement();
    const playerObj = player.getPlayerObj();
    board.updateBoard(playerObj.x, playerObj.y);
    player.upgradePlayer();
}

function playerMovement() {
    const playerObj = player.getPlayerObj();
    let newX = playerObj.x;
    let newY = playerObj.y;

    const isMultiDirection = keys ? Object.keys(keys).filter((key) => (key == 'd' || key == 'a' || key == 'w' || key == 's') && keys[key]).length > 1 : false;
    const distance = isMultiDirection ? (secondsPassed * GameVariables.playerSpeed) / 1.4142 : secondsPassed * GameVariables.playerSpeed;

    if (keys && keys['d']) { newX -= distance; }
    if (keys && keys['a']) { newX += distance; }
    if (keys && keys['w']) { newY += distance; }
    if (keys && keys['s']) { newY -= distance; }

    const playerBoardX = Math.abs(newX - (GameVariables.gameWidth / 2));
    const playerBoardY = Math.abs(newY - (GameVariables.gameHeight / 2));

    const newPlayerObj = new SquareObject(playerBoardX - GameVariables.halfSprite, playerBoardY + (GameVariables.halfSprite / 4), playerObj.w, playerObj.h);
    const newPlayerArea = new CircleObject(playerBoardX, playerBoardY + (GameVariables.halfSprite - GameVariables.halfSprite/4), player.getPlayerArea().r);

    if (board.hasCollision(newPlayerObj)) {
        newX = playerObj.x;
        newY = playerObj.y;
    }

    player.setCollisionInArea(board.hasAreaCollision(newPlayerArea));

    playerObj.x = newX;
    playerObj.y = newY;
}

function clean() {
    player.cleanPlayer();
    minimap.cleanMinimap();
}

function draw() {
    player.drawPlayer(keys);
    minimap.drawMinimap(player.getPlayerObj());
}