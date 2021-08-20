import { GameVariables } from "./game-variables";
import { SquareObject } from "./square-object";

export class Player {

    constructor(mainDiv) {
        const initialPosition = (GameVariables.spriteSize * GameVariables.boardScaleMultiplier * GameVariables.boardSize) / 2;
        this.x = -initialPosition + (GameVariables.gameWidth / 2);
        this.y = -initialPosition + (GameVariables.gameHeight / 2);
        this.playerWidthPos = (GameVariables.gameWidth / 2);
        this.playerHeightPos = (GameVariables.gameHeight / 2);
        this.speed = GameVariables.playerSpeed;
        this.sanity = 0; 

        this.playerObj = new SquareObject(this.x, this.y, GameVariables.spriteSize, GameVariables.spriteSize);;

        // can be refactor to utilities
        var canvas = document.createElement('canvas');
        canvas.width = GameVariables.gameWidth;
        canvas.height = GameVariables.gameHeight;
        mainDiv.appendChild(canvas);

        this.context = canvas.getContext('2d');
    }

     getPlayerObj() {
        return this.playerObj;
    }

    cleanPlayer() {
        this.context.clearRect(this.playerWidthPos, this.playerHeightPos, GameVariables.spriteSize, GameVariables.spriteSize);
    }

    drawPlayer() {
        this.context.beginPath();
        this.context.rect(this.playerWidthPos, this.playerHeightPos, GameVariables.spriteSize, GameVariables.spriteSize);
        this.context.fillStyle = "green";
        this.context.fill();
    }
}