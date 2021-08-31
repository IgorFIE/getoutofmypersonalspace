import { GameVariables, PIXEL_MULTIPLIER } from "../game-variables";
import { convertTextToPixelArt, drawPixelTextInCanvasContext } from "../utilities/text";

export class ScoreBoard {
    constructor(mainDiv) {
        this.scoreCanvas = document.createElement('canvas');
        this.scoreCanvas.id = 'score';
        this.scoreCanvas.width = GameVariables.gameWidth;
        this.scoreCanvas.height = GameVariables.gameHeight;
        mainDiv.appendChild(this.scoreCanvas);

        this.scoreContext = this.scoreCanvas.getContext('2d');
        this.scoreContext.imageSmoothingEnabled = false;

        this.currentScore = 0;

        this.drawScoreMessage();
        this.drawScore();
    }

    cleanScore(){
        this.scoreContext.clearRect(0, 76 - (PIXEL_MULTIPLIER * 3), GameVariables.gameWidth, GameVariables.gameHeight / 3);
    }

    updateScore() {
        this.currentScore++;
        this.cleanScore();
        this.drawScore();
    }

    drawScoreMessage() {
        const scoreMessageHasPixels = convertTextToPixelArt('SCORE');
        drawPixelTextInCanvasContext(scoreMessageHasPixels, this.scoreCanvas, PIXEL_MULTIPLIER, 28 + PIXEL_MULTIPLIER * 2);
    }

    drawScore(){
        const scoreHasPixels = convertTextToPixelArt(this.currentScore);
        drawPixelTextInCanvasContext(scoreHasPixels, this.scoreCanvas, PIXEL_MULTIPLIER * 2, 76 + PIXEL_MULTIPLIER * 2);
    }
}