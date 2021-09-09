import { Board } from "./entities/board";
import { Player } from "./entities/player";
import { GameVariables } from "./game-variables";
import { SquareObject } from "./objects/square-object";
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
        this.keys = [];
        this.secondsPassed = 0;
        this.fps = 0;

        const actionDiv = document.createElement('div');
        actionDiv.id = 'actionDiv';
        this.gameDiv.appendChild(actionDiv);

        this.board = new Board(actionDiv);

        this.actionCanvas = document.createElement('canvas');
        this.actionCanvas.id = 'actionCanvas'
        this.actionCanvas.width = GameVariables.boardRealSize;
        this.actionCanvas.height = GameVariables.boardRealSize;
        actionDiv.appendChild(this.actionCanvas);

        this.actionContext = this.actionCanvas.getContext('2d');
        this.actionContext.imageSmoothingEnabled = false;
        this.actionRect = new SquareObject(0, 0, GameVariables.boardSpriteSize * 4, GameVariables.boardSpriteSize * 2);

        this.scoreBoard = new ScoreBoard(this.gameDiv);
        this.minimap = new Minimap(this.board.getBoard(), this.gameDiv);

        this.enemies = [];
        this.newEnemyObj = new SquareObject(0, 0, GameVariables.spriteSize, GameVariables.spriteSize);

        this.item = new Item();
        this.item.generateNewItem({ x: 5, y: 5 });

        this.player = new Player();
        this.player.drawPlayer(this.keys, this.actionContext);

        this.updateCanvasPositions();
    }

    isGameOver() {
        return this.player.getPlayerAnxiety() >= GameVariables.playerMaxAnxiety;
    }

    gameLoop(secondsPassed, keys) {
        this.secondsPassed = secondsPassed;
        this.keys = keys;
        this.generateEnemy();
        if (!this.isGameOver()) {
            this.update();
            this.clean();
            this.draw();
        }
    }

    update() {
        this.enemies.forEach((it) => it.enemyMovement(this.board, this.secondsPassed));
        this.player.updatePlayerMovement(this.board, this.keys, this.secondsPassed);
        this.updateGameLogic();
        this.updateCanvasPositions();
    }

    generateEnemy() {
        if (this.enemies.length < GameVariables.enemyNumber) {
            this.newEnemyObj.x = this.generateRandomPositionInsideBoard();
            this.newEnemyObj.y = this.generateRandomPositionInsideBoard();
            const hasBoardCollision = this.board.hasCollision(this.newEnemyObj);
            const hasPlayerCollision = rectCollision(this.retrieveActionDrawArea(), this.newEnemyObj);
            if (!hasBoardCollision && !hasPlayerCollision) {
                this.enemies.push(new Enemy(this.newEnemyObj));
            }
        }
    }

    generateRandomPositionInsideBoard() {
        const min = GameVariables.boardSpriteSize + GameVariables.pixelMulpiplier;
        const max = (GameVariables.boardSpriteSize * GameVariables.boardSize) - min;
        return randomNumberOnRange(min, max);
    }

    updateGameLogic() {
        const playerBoardRect = generalRectToBoardRect(this.player.getPlayerRect(), this.board.getBoard());
        if (this.item.hasCollision(this.player.getPlayerRect())) {
            this.item.generateNewItem(playerBoardRect);
            this.scoreBoard.updateScore();
            this.sound.playPickSound();
        }
        this.minimap.drawMinimap(playerBoardRect.x, playerBoardRect.y, this.item.getItemBoardPosX, this.item.getItemBoardPosY);

        const hasEnemyInPlayerArea = this.hasEnemyInPlayerArea(this.player.getPlayerArea());
        this.player.setCollisionInPlayerArea(hasEnemyInPlayerArea);
        if (hasEnemyInPlayerArea) {
            this.sound.playInAreaSound();
        } else {
            this.sound.stopInAreaSound();
        }
        this.player.updatePlayerAnxietyArea();
        this.player.updatePlayerAnxietyLevel();
    }

    updateCanvasPositions() {
        const updateGameWidthPosition = Math.round(-this.player.getPlayerRect().x + GameVariables.gameHalfWidth - (this.player.getPlayerRect().w / 2));
        const updateGameHeightPosition = Math.round(-this.player.getPlayerRect().y + GameVariables.gameHalfHeight - (this.player.getPlayerRect().h / 2));
        this.board.updateBoard(updateGameWidthPosition, updateGameHeightPosition);
        this.actionCanvas.style.transform = 'translate(' + updateGameWidthPosition + 'px, ' + updateGameHeightPosition + 'px)';
    }

    hasEnemyInPlayerArea(movingObject) {
        return !!this.enemies.find((it) => rectCircleCollision(movingObject, it.getEnemyObj()));
    }

    clean() {
        this.actionContext.clearRect(0, 0, this.actionCanvas.width, this.actionCanvas.height);
    }

    draw() {
        const drawArea = this.retrieveActionDrawArea();
        this.enemies.forEach((enemy) => {
            if (rectCollision(drawArea, enemy.getEnemyObj())) {
                enemy.drawEnemy(this.actionContext)
            }
        });
        if (this.item.hasCollision(drawArea)) {
            this.item.drawItem(this.actionContext);
        }
        this.player.drawPlayer(this.keys, this.actionContext);
    }

    retrieveActionDrawArea() {
        this.actionRect.x = this.player.getPlayerRect().x - GameVariables.boardSpriteSize * 2;
        this.actionRect.y = this.player.getPlayerRect().y - GameVariables.boardSpriteSize;
        return this.actionRect;
    }

    destroy() {
        this.gameDiv.innerHTML = '';
    }
}