import { Board } from "./entities/board";
import { Player } from "./entities/player";
import { GameVariables } from "./game-variables";
import { SquareObject } from "./objects/square-object";
import { CircleObject } from "./objects/circle-object";
import { Minimap } from "./entities/minimap";
import { Item } from "./entities/item";
import { ScoreBoard } from "./entities/score-board";
import { Enemy } from "./entities/enemy";
import { rectCircleCollision, rectCollision } from "./utilities/collision-utilities";
import { generalRectToBoardRect, randomNumberOnRange } from "./utilities/util";

export class Game {
    constructor(gameDiv, sound) {
        this.gameDiv = gameDiv;
        this.gameDiv.style.width = GameVariables.gameWidth + 'px';
        this.gameDiv.style.height = GameVariables.gameHeight + 'px';

        this.sound = sound;

        this.board = new Board(this.gameDiv);

        this.minimap = new Minimap(this.board.getBoard(), this.gameDiv);
        
        this.item = new Item(this.gameDiv);
        this.item.generateNewItem({ x: 5, y: 5 });

        this.keys = [];

        this.secondsPassed = 0;

        this.fps = 0;
        this.scoreBoard = new ScoreBoard(this.gameDiv);

        this.enemies = [];
        this.enemyCanvas = document.createElement('canvas');
        this.enemyCanvas.width = GameVariables.boardRealSize;
        this.enemyCanvas.height = GameVariables.boardRealSize;
        this.gameDiv.appendChild(this.enemyCanvas);

        this.enemyContext = this.enemyCanvas.getContext('2d');
        this.enemyContext.imageSmoothingEnabled = false;

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

        const newPlayerRect = new SquareObject(playerBoardX - GameVariables.halfSprite, playerBoardY + (GameVariables.halfSprite / 4), playerObj.w, playerObj.h);
        const newPlayerArea = new CircleObject(playerBoardX, playerBoardY + (GameVariables.halfSprite - GameVariables.halfSprite / 4), this.player.getPlayerArea().r);

        if (this.board.hasCollision(newPlayerRect)) {
            newX = playerObj.x;
            newY = playerObj.y;
            newPlayerRect.x = playerBoardObj.x;
            newPlayerRect.y = playerBoardObj.y;
        }

        const playerBoardRect = generalRectToBoardRect(newPlayerRect, this.board.getBoard());
        if (this.item.hasCollision(newPlayerRect)) {
            this.sound.playPickSound();
            this.item.generateNewItem(playerBoardRect);
            this.scoreBoard.updateScore();
        }

        this.minimap.drawMinimap(playerBoardRect.x, playerBoardRect.y, this.item.getItemBoardPosX, this.item.getItemBoardPosY);

        const hasEnemyInPlayerArea = this.hasEnemyInPlayerArea(newPlayerArea)
        this.player.setCollisionInArea(hasEnemyInPlayerArea);
        if(hasEnemyInPlayerArea){
            this.sound.playInAreaSound();
        } else {
            this.sound.stopInAreaSound();
        }

        playerObj.x = newX;
        playerObj.y = newY;
        playerBoardObj.x = newPlayerRect.x;
        playerBoardObj.y = newPlayerRect.y;
    }

    clean() {
        this.player.cleanPlayer();
        this.enemyContext.clearRect(0, 0, this.enemyCanvas.width, this.enemyCanvas.height);
    }

    draw() {
        this.enemies.forEach((it) => it.drawEnemy(this.enemyContext));
        this.player.drawPlayer(this.keys);
    }

    generateEnemy() {
        if (this.enemies.length < GameVariables.enemyNumber) {
            const newEnemyObj = new SquareObject(this.generateRandomPositionInsideBoard(), this.generateRandomPositionInsideBoard(), GameVariables.spriteSize, GameVariables.spriteSize);
            const hasBoardCollision = this.board.hasCollision(newEnemyObj);
            const hasEnemyCollision = !!this.enemies.find((it) => rectCollision(it.getEnemyObj(), newEnemyObj));

            // todo improve spawn area
            const hasPlayerCollision = rectCollision(new SquareObject(
                this.player.getPlayerBoardObj().x - GameVariables.boardSpriteSize,
                this.player.getPlayerBoardObj().y - GameVariables.boardSpriteSize,
                GameVariables.boardSpriteSize * 2,
                GameVariables.boardSpriteSize * 3
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
        const min = GameVariables.boardSpriteSize + GameVariables.pixelMulpiplier;
        const max = (GameVariables.boardSpriteSize * GameVariables.boardSize) - min;
        return randomNumberOnRange(min,max);
    }

    destroy() {
        this.gameDiv.innerHTML = '';
    }
}