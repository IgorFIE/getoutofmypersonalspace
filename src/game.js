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

export class Game {
    constructor() {
        this.gameDiv = null;
        this.board = null;
        this.minimap = null;
        this.player = null;
        this.item = null;
        this.keys = [];

        this.secondsPassed = 0;

        this.fps = 0;
        this.scoreBoard = null;

        this.enemies = [];
        this.enemyCanvas = null;
        this.enemyContext = null;
    }


    init(newGameDiv) {
        this.gameDiv = newGameDiv;
        this.gameDiv.style.width = GameVariables.gameWidth + 'px';
        this.gameDiv.style.height = GameVariables.gameHeight + 'px';

        this.board = new Board(this.gameDiv);
        this.board.initBoard();

        this.enemyCanvas = document.createElement('canvas');
        const spriteWithMultiplier = GameVariables.spriteSize * GameVariables.boardScaleMultiplier;
        this.enemyCanvas.width = GameVariables.boardSize * spriteWithMultiplier;
        this.enemyCanvas.height = GameVariables.boardSize * spriteWithMultiplier;
        this.gameDiv.appendChild(this.enemyCanvas);

        this.enemyContext = this.enemyCanvas.getContext('2d');
        this.enemyContext.imageSmoothingEnabled = false;

        this.minimap = new Minimap(this.board.getBoard(), this.gameDiv);

        this.item = new Item(this.gameDiv);
        this.item.generateNewItem({ x: 5, y: 5 });

        this.scoreBoard = new ScoreBoard(this.gameDiv);

        this.player = new Player(this.gameDiv);
        this.player.drawPlayer();

        const playerObj = this.player.getPlayerObj();
        this.board.updateBoard(playerObj.x, playerObj.y);
        this.item.updateItem(playerObj.x, playerObj.y);
    }

    isGameOver() {
        return this.player.getPlayerAnsiety() >= GameVariables.playerMaxAnsiety;
    }

    gameLoop(secondsPassed, keys) {
        this.secondsPassed = secondsPassed;
        this.keys = keys;
        if (!this.isGameOver()) {
            this.update();
            this.clean();
            this.draw();
        }
    }

    update() {
        this.generateEnemy();
        this.enemies.forEach((it) => it.enemyMovement(this.board, this.secondsPassed));
        this.playerMovement();
        const playerObj = this.player.getPlayerObj();
        this.board.updateBoard(playerObj.x, playerObj.y);
        this.item.updateItem(playerObj.x, playerObj.y);
        this.player.upgradePlayer();
        this.enemyCanvas.style.transform = 'translate(' + playerObj.x + 'px, ' + playerObj.y + 'px)';
    }

    playerMovement() {
        const playerBoardObj = this.player.getPlayerBoardObj();
        const playerObj = this.player.getPlayerObj();
        let newX = playerObj.x;
        let newY = playerObj.y;

        const isMultiDirection = this.keys ? Object.keys(this.keys).filter((key) => (key == 'd' || key == 'a' || key == 'w' || key == 's') && this.keys[key]).length > 1 : false;
        const distance = isMultiDirection ? (this.secondsPassed * GameVariables.playerSpeed) / 1.4142 : this.secondsPassed * GameVariables.playerSpeed;

        if (this.keys['d']) { newX -= distance; }
        if (this.keys['a']) { newX += distance; }
        if (this.keys['w']) { newY += distance; }
        if (this.keys['s']) { newY -= distance; }

        const playerBoardX = Math.abs(newX - (GameVariables.gameWidth / 2));
        const playerBoardY = Math.abs(newY - (GameVariables.gameHeight / 2));

        const newPlayerObj = new SquareObject(playerBoardX - GameVariables.halfSprite, playerBoardY + (GameVariables.halfSprite / 4), playerObj.w, playerObj.h);
        const newPlayerArea = new CircleObject(playerBoardX, playerBoardY + (GameVariables.halfSprite - GameVariables.halfSprite / 4), this.player.getPlayerArea().r);

        if (this.board.hasCollision(newPlayerObj)) {
            newX = playerObj.x;
            newY = playerObj.y;
            newPlayerObj.x = playerBoardObj.x;
            newPlayerObj.y = playerBoardObj.y;
        }

        const playerXYBoardPos = this.board.getBoardXYPosition(newPlayerArea);
        if (this.item.hasCollision(newPlayerObj)) {
            this.item.generateNewItem(playerXYBoardPos);
            this.scoreBoard.updateScore();
        }
        this.minimap.drawMinimap(playerXYBoardPos.x, playerXYBoardPos.y, this.item.getItemBoardPosX, this.item.getItemBoardPosY);

        this.player.setCollisionInArea(this.hasEnemyInPlayerArea(newPlayerArea));

        playerObj.x = newX;
        playerObj.y = newY;
        playerBoardObj.x = newPlayerObj.x;
        playerBoardObj.y = newPlayerObj.y;
    }

    clean() {
        this.player.cleanPlayer();
        this.enemyContext.clearRect(0, 0, this.enemyCanvas.width, this.enemyCanvas.height);
    }

    draw() {
        this.player.drawPlayer(this.keys);
        this.enemies.forEach((it) => it.drawEnemy(this.enemyContext));
    }

    generateEnemy() {
        if (this.enemies.length < GameVariables.enemyNumber) {
            const boardSpriteSize = GameVariables.spriteSize * GameVariables.boardScaleMultiplier;
            const newEnemyObj = new SquareObject(this.generateRandomPositionInsideBoard(), this.generateRandomPositionInsideBoard(), GameVariables.spriteSize, GameVariables.spriteSize);
            const hasBoardCollision = this.board.hasCollision(newEnemyObj);
            const hasEnemyCollision = !!this.enemies.find((it) => rectCollision(it.getEnemyObj(), newEnemyObj));

            // need to check this afterwards
            const hasPlayerCollision = rectCollision(new SquareObject(
                this.player.getPlayerBoardObj().x - boardSpriteSize,
                this.player.getPlayerBoardObj().y - boardSpriteSize,
                boardSpriteSize * 2,
                boardSpriteSize * 3
            ), newEnemyObj);

            if (!hasBoardCollision && !hasEnemyCollision && !hasPlayerCollision) {
                this.enemies.push(new Enemy(newEnemyObj, this.gameDiv));
            }
        }
    }

    hasEnemyInPlayerArea(movingObject) {
        return !!this.enemies.find((it) => rectCircleCollision(movingObject, it.getEnemyObj()));
    }

    generateRandomPositionInsideBoard() {
        const boardSpriteSize = GameVariables.spriteSize * GameVariables.boardScaleMultiplier;
        const min = boardSpriteSize + PIXEL_MULTIPLIER;
        const max = (boardSpriteSize * GameVariables.boardSize) - boardSpriteSize + PIXEL_MULTIPLIER;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    destroy() {
        this.gameDiv.innerHTML = '';
    }
}