import { GameVariables } from "./game-variables";
import { convertGeneralPosToBoardPos } from "./util";

const minimapBuildColor = 'rgba(112, 58, 51, 0.8)';
const minimapFloorColor = 'rgba(218, 220, 241, 0.8)';
const minimapItemColor = 'rgba(255,255,0,0.8)';
const minimapPlayerColor = 'rgba(0,0,255,255.8)';

export class Minimap {
    constructor(board) {
        this.board = board;

        this.canvas = document.getElementById('minimap');
        this.canvas.width = (GameVariables.halfSprite / 4) * GameVariables.boardSize;
        this.canvas.height = (GameVariables.halfSprite / 4) * GameVariables.boardSize;
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
    }

    updateMinimap() {
    }

    cleanMinimap() {
        this.context.clearRect(0, 0, GameVariables.gameWidth, GameVariables.gameHeight);
    }

    // missing Player position on the board here playerX, playerYÎ
    drawMinimap(playerObj, itemBoardPosX, itemBoardPosY) {
        const playerBoardPosX = convertGeneralPosToBoardPos(playerObj.x);
        const playerBoardPosY = convertGeneralPosToBoardPos(playerObj.y);

        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                const isEdge = y === 0 || y === GameVariables.boardSize - 1 || x === 0 || x === GameVariables.boardSize - 1;
                const isBuild = x % 2 === 0 && y % 2 === 0;
                if (isEdge || isBuild) {
                    this.drawBlock(x, y, minimapBuildColor);
                } else {
                    if (playerBoardPosX === x && playerBoardPosY === y) {
                        this.drawBlock(x, y, minimapPlayerColor);
                    } else if (itemBoardPosX === x && itemBoardPosY === y) {
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
}