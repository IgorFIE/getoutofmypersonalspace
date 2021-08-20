import { BoardObject } from "./board-object";
import { GameVariables } from "./game-variables";

export class Board {

    constructor(mainDiv) {
        this.board = [];
        this.boardCollisionObjs = [];

        this.canvas = document.createElement('canvas');
        mainDiv.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');
    }

    initBoard() {
        const spriteWithMultiplier = GameVariables.spriteSize * GameVariables.boardScaleMultiplier;
        this.canvas.width = GameVariables.boardSize * spriteWithMultiplier;
        this.canvas.height = GameVariables.boardSize * spriteWithMultiplier;
        for (let y = 0; y < GameVariables.boardSize; y++) {
            let newBoardRow = [];
            for (let x = 0; x < GameVariables.boardSize; x++) {
                const isEdge = y === 0 || y === GameVariables.boardSize - 1 || x === 0 || x === GameVariables.boardSize - 1;
                const isBuild = x % 2 === 0 && y % 2 === 0;
                const currentBlockType = isEdge || isBuild ? 1 : 0;
                const boardObj = new BoardObject(x * spriteWithMultiplier, y * spriteWithMultiplier, spriteWithMultiplier, spriteWithMultiplier, currentBlockType);
                this.drawBoardPiece(boardObj);
                if (currentBlockType === 1) {
                    this.boardCollisionObjs.push(boardObj);
                }
                newBoardRow.push(boardObj);
            }
            this.board.push(newBoardRow);
        }
    }

    drawBoardPiece(boardObj) {
        this.context.beginPath();
        if (boardObj.objType === 1) {
            this.context.fillStyle = "black";
        } else {
            this.context.fillStyle = "grey";
        }
        this.context.fillRect(boardObj.x, boardObj.y, boardObj.w, boardObj.h);
    }

    updateBoard(playerX, playerY) {
        this.canvas.style.transform = 'translate(' + playerX + 'px, ' + playerY + 'px)';
    }

    hasCollision(movingObject) {
        return !!this.boardCollisionObjs.find( (it) => this.rectIntersect(it,movingObject));
    }

    rectIntersect(obj1, obj2) {
        if (obj2.x > obj1.w + obj1.x || obj1.x > obj2.w + obj2.x || obj2.y > obj1.h + obj1.y || obj1.y > obj2.h + obj2.y) {
            return false;
        }
        return true;
    }
}