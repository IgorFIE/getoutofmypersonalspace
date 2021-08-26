import { GameVariables } from "./game-variables";

const minimapBuildColor = 'rgba(112, 58, 51, 0.8)';
const minimapFloorColor = 'rgba(218, 220, 241, 0.8)';
const minimapItemColor = 'rgba(255,255,0,0.8)';
const minimapPlayerColor = 'rgba(0,0,255,255.8)';

export class Minimap {
    constructor(board) {
        this.board = board;
        this.itemPosX = 0;
        this.itemPosY = 0;

        this.canvas = document.getElementById('minimap');
        this.canvas.width = (GameVariables.halfSprite / 4) * GameVariables.boardSize;
        this.canvas.height = (GameVariables.halfSprite / 4) * GameVariables.boardSize;
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
    }

    generateNewItemRandomPositions(newPosX, newPosY) {
        const isBuild = newPosX % 2 === 0 && newPosY % 2 === 0;
        const equalsToLastValues = this.itemPosX === newPosX && this.itemPosY === newPosY;
        if (isBuild || equalsToLastValues) {
            this.generateNewItemRandomPositions(this.generateRandomNumberInsideBoard(), this.generateRandomNumberInsideBoard())
        } else {
            this.itemPosX = newPosX;
            this.itemPosY = newPosY;
        }
    }

    generateRandomNumberInsideBoard() {
        const min = Math.ceil(1);
        const max = Math.floor(GameVariables.boardSize - 2);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    updateMinimap() {
        this.generateNewItemRandomPositions(this.itemPosX, this.itemPosX);
    }

    cleanMinimap() {
        this.context.clearRect(0, 0, GameVariables.gameWidth, GameVariables.gameHeight);
    }

    // missing Player position on the board here playerX, playerYÎ
    drawMinimap(playerObj) {
        const playerBoardPosX = this.convertPlayerPosToBoardPos(playerObj.x);
        const playerBoardPosY = this.convertPlayerPosToBoardPos(playerObj.y);

        console.log(playerBoardPosX, playerBoardPosY);

        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                const isEdge = y === 0 || y === GameVariables.boardSize - 1 || x === 0 || x === GameVariables.boardSize - 1;
                const isBuild = x % 2 === 0 && y % 2 === 0;
                if (isEdge || isBuild) {
                    this.drawBlock(x, y, minimapBuildColor);
                } else {
                    if (playerBoardPosX === x && playerBoardPosY === y) {
                        this.drawBlock(x, y, minimapPlayerColor);
                    } else if (this.itemPosX === x && this.itemPosY === y) {
                        this.drawBlock(x, y, minimapItemColor);
                    } else {
                        this.drawBlock(x, y, minimapFloorColor);
                    }
                }
            }
        }
    }

    drawBlock(x, y, color) {
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.fillRect(
            (x * (GameVariables.halfSprite / 4)),
            (y * (GameVariables.halfSprite / 4)),
            (GameVariables.halfSprite / 4), (GameVariables.halfSprite / 4));
    }

    convertPlayerPosToBoardPos(value) {
        const boardRealSize = GameVariables.spriteSize * GameVariables.boardScaleMultiplier * this.board.length;
        const playerBoardPos = (this.board.length * value) / -boardRealSize;
        if (playerBoardPos < 1) {
            return 1;
        } else if (playerBoardPos > GameVariables.boardSize - 2) {
            return GameVariables.boardSize - 2;
        } else {
            return  Math.round(playerBoardPos);
        }

    }
}