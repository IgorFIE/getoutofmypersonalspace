import { GameVariables } from "./game-variables";
import { SquareObject } from "./square-object";

export class Player {

    constructor(mainDiv) {
        const initialPosition = (GameVariables.spriteSize * GameVariables.boardScaleMultiplier * GameVariables.boardSize) / 2;
        this.x = -initialPosition + (GameVariables.gameWidth / 2);
        this.y = -initialPosition + (GameVariables.gameHeight / 2);
        this.playerWidthPos = (GameVariables.gameWidth / 2) - GameVariables.halfSprite;
        this.playerHeightPos = (GameVariables.gameHeight / 2) - GameVariables.halfSprite;
        this.speed = GameVariables.playerSpeed;
        this.sanity = 0;

        this.playerObj = new SquareObject(this.x, this.y, GameVariables.spriteSize, GameVariables.spriteSize);;

        // can be refactor to utilities
        const canvas = document.createElement('canvas');
        canvas.width = GameVariables.gameWidth;
        canvas.height = GameVariables.gameHeight;
        mainDiv.appendChild(canvas);

        this.context = canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;

        this.img = new Image();
        this.img.src = './img/main_char.png';
    }

    getPlayerObj() {
        return this.playerObj;
    }

    cleanPlayer() {
        this.context.clearRect(0, 0, GameVariables.gameWidth, GameVariables.gameHeight);
    }

    drawPlayer() {
        this.context.drawImage(this.img,this.playerWidthPos, this.playerHeightPos, GameVariables.spriteSize, GameVariables.spriteSize);

        this.context.beginPath();
        this.context.lineWidth = "" + GameVariables.halfSprite;
        this.context.strokeStyle = "green";
        this.context.arc(this.playerWidthPos + GameVariables.halfSprite, this.playerHeightPos + GameVariables.halfSprite, GameVariables.spriteSize, 0, 2 * Math.PI);
        this.context.stroke();
    }
}