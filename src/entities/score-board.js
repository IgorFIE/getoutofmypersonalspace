import { GameVariables, PIXEL_MULTIPLIER } from "../game-variables";
import { convertTextToPixelArt, drawPixelTextInCanvasContext } from "../utilities/text";

export class ScoreBoard {
    constructor(mainDiv) {
        this.scoreMessageCanvas = document.createElement('canvas');
        this.scoreMessageCanvas.id = 'scoreMessage';
        this.scoreMessageCanvas.width = GameVariables.gameWidth;
        this.scoreMessageCanvas.height = GameVariables.gameHeight;
        mainDiv.appendChild(this.scoreMessageCanvas);

        this.scoreMessageContext = this.scoreMessageCanvas.getContext('2d');
        this.scoreMessageContext.imageSmoothingEnabled = false;

        this.scoreNumberCanvas = document.createElement('canvas');
        this.scoreNumberCanvas.id = 'scoreNumber';
        this.scoreNumberCanvas.width = GameVariables.gameWidth;
        this.scoreNumberCanvas.height = GameVariables.gameHeight;
        mainDiv.appendChild(this.scoreNumberCanvas);

        this.scoreNumberContext = this.scoreNumberCanvas.getContext('2d');
        this.scoreNumberContext.imageSmoothingEnabled = false;

        this.currentScore = 0;

        this.init();
    }

    init() {
        this.drawScoreMessage();
        this.drawScore();
    }

    cleanScore(){
        this.scoreNumberContext.clearRect(0, 0, GameVariables.gameWidth, GameVariables.gameHeight);
    }

    updateScore() {
        this.currentScore++;
        this.cleanScore();
        this.drawScore();
    }

    drawScoreMessage() {
        const scoreMessageHasPixels = convertTextToPixelArt('SCORE');
        drawPixelTextInCanvasContext(scoreMessageHasPixels, this.scoreMessageCanvas, PIXEL_MULTIPLIER);
    }

    drawScore(){
        const scoreHasPixels = convertTextToPixelArt(this.currentScore);
        drawPixelTextInCanvasContext(scoreHasPixels, this.scoreNumberCanvas, PIXEL_MULTIPLIER * 2);
    }
}