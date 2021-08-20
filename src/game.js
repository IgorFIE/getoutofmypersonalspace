import { Board } from "./board";
import { Player } from "./player";
import { GameVariables } from "./game-variables";
import { SquareObject } from "./square-object";

let mainDiv;
let board;
let player;
let x;
let y;
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

    player = new Player(mainDiv);
    const playerObj = player.getPlayerObj();
    x = playerObj.x;
    y = playerObj.y;
    player.drawPlayer();
    playerEvents();

    window.requestAnimationFrame(gameLoop);
}

function playerEvents() {
    window.addEventListener("keydown", event => {
        if (event.key == 'd') {
            x -= GameVariables.playerSpeed * secondsPassed;
        } else if (event.key == 'a') {
            x += GameVariables.playerSpeed * secondsPassed;
        } else if (event.key == 'w') {
            y += GameVariables.playerSpeed * secondsPassed;
        } else if (event.key == 's') {
            y -= GameVariables.playerSpeed * secondsPassed;
        }
        console.log(x, y);

    });
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
    // const playerObj = player.getPlayerObj();
    // if (!board.hasCollision(new SquareObject(x, y, GameVariables.spriteSize, GameVariables.spriteSize))) {
    //     playerObj.x = x;
    //     playerObj.y = x;
    // } else {
    //     x = playerObj.x;
    //     y = playerObj.y;
    // }
    board.updateBoard(x, y);
}

function clean() {
    player.cleanPlayer();
}

function draw() {
    player.drawPlayer();
}