import { GameVariables } from "../game-variables";
import { convertTextToPixelArt, drawPixelTextInCanvasContext } from "../utilities/text";

export class ScoreBoard {
    constructor(mainDiv, highScore) {
        this.scoreCanvas = document.createElement('canvas');
        this.scoreCanvas.id = 'score';
        this.scoreCanvas.width = GameVariables.gameWidth;
        this.scoreCanvas.height = GameVariables.gameHeight;
        mainDiv.appendChild(this.scoreCanvas);

        this.scoreContext = this.scoreCanvas.getContext('2d');
        this.scoreContext.imageSmoothingEnabled = false;

        this.highScore = highScore;
        this.currentScore = this.highScore;

        this.drawScoreMessage('BEST SCORE');
        this.drawScore();
    }

    resetGameScoreBoard() {
        this.currentScore = 0;
        this.cleanScore();
        this.drawScoreMessage('SCORE');
        this.drawScore();
    }

    getCurrentScore(){
        return this.currentScore;
    }

    cleanScore(){
        this.scoreContext.clearRect(0, 0, GameVariables.gameWidth, GameVariables.gameHeight / 3);
    }

    updateScore() {
        this.currentScore++;
        this.cleanScore();
        const scoreMessage = this.currentScore > this.highScore ? 'NEW HIGH SCORE' : 'SCORE';
        this.drawScoreMessage(scoreMessage);
        this.drawScore();
    }

    drawScoreMessage(scoreMessage) {
        const scoreMessageHasPixels = convertTextToPixelArt(scoreMessage);
        drawPixelTextInCanvasContext(scoreMessageHasPixels, this.scoreCanvas, GameVariables.pixelMulpiplier, 28 + GameVariables.pixelMulpiplier * 2);
    }

    drawScore(){
        const scoreHasPixels = convertTextToPixelArt(this.currentScore);
        drawPixelTextInCanvasContext(scoreHasPixels, this.scoreCanvas, GameVariables.pixelMulpiplier * 2, 76 + GameVariables.pixelMulpiplier * 2);
    }
}