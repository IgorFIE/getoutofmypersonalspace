import { BoardObject } from "./board-object";
import { GameVariables } from "./game-variables";
import { PIXEL_MULTIPLIER } from "./game-variables";
import { rectCollision, rectCircleCollision } from "./collision-utilities";

export class Board {

    constructor(mainDiv) {
        this.board = [];
        this.boardCollisionObjs = [];

        this.canvas = document.createElement('canvas');
        mainDiv.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
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
        if (boardObj.objType === 1) {
            for (let y = 0; y < buildingTile.length; y++) {
                for (let x = 0; x < buildingTile[y].length; x++) {
                    const currentColor = buildingTile[y][x];
                    if (currentColor) {
                        this.context.beginPath();
                        this.context.fillStyle = currentColor;
                        this.context.fillRect(
                             boardObj.x + (x * boardObj.w / 16),
                             boardObj.y + (y * boardObj.h / 16),
                            boardObj.w / 16, boardObj.h / 16);
                    }
                }
            }
        } else {
            // Need to simplify this
            for (let yMultiplier = 0; yMultiplier < (PIXEL_MULTIPLIER / 2); yMultiplier++) {
                const yTilePosition = yMultiplier * (boardObj.h / 2);
                for (let xMultiplier = 0; xMultiplier < (PIXEL_MULTIPLIER / 2); xMultiplier++) {
                    const xTilePosition = xMultiplier * (boardObj.w / 2);
                    for (let y = 0; y < floorTile.length; y++) {
                        for (let x = 0; x < floorTile[y].length; x++) {
                            const currentColor = floorTile[y][x];
                            if (currentColor) {
                                this.context.beginPath();
                                this.context.fillStyle = currentColor;
                                this.context.fillRect(
                                    xTilePosition + boardObj.x + (x * boardObj.w / 32),
                                    yTilePosition + boardObj.y + (y * boardObj.h / 32),
                                    boardObj.w / 32, boardObj.h / 32);
                            }
                        }
                    }
                }
            }
        }
    }

    updateBoard(x, y) {
        this.canvas.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

    hasCollision(movingObject) {
        return !!this.boardCollisionObjs.find((it) => rectCollision(it, movingObject));
    }

    // remove after testing
    hasAreaCollision(movingObject) {
        return !!this.boardCollisionObjs.find((it) => {
            const result = rectCircleCollision(movingObject, it)
            if(result){
                console.log('colision');
            }
            return result;
        });
    }
}

const floorBrightColor = '#dadcf1';
const floorMiddleColor = '#a7abd2';
const floorDarkColor = '#64768f';
const floorTile = [
    [floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor],
    [floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor],
    [floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor],
    [floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor],
    [floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor],
    [floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor],
    [floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor],
    [floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor],
    [floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor, floorDarkColor],
    [floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor],
    [floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor],
    [floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor],
    [floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor],
    [floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor],
    [floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor],
    [floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorBrightColor, floorDarkColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorMiddleColor, floorDarkColor],
];

const buildColor = '#703a33';
const buildWindowColor = '#38252e';
const buildShadow = '#2f1519';
const buildWindowBorder = '#865433';
const buildingTile = [
    [buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor],
    [buildColor, buildShadow, buildShadow, buildShadow, buildShadow, buildColor, buildShadow, buildShadow, buildShadow, buildShadow, buildColor, buildShadow, buildShadow, buildShadow, buildShadow, buildColor],
    [buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor],
    [buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor],
    [buildColor, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildColor, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildColor, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildColor],
    [buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor],
    [buildColor, buildShadow, buildShadow, buildShadow, buildShadow, buildColor, buildShadow, buildShadow, buildShadow, buildShadow, buildColor, buildShadow, buildShadow, buildShadow, buildShadow, buildColor],
    [buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor],
    [buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor],
    [buildColor, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildColor, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildColor, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildColor],
    [buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor],
    [buildColor, buildShadow, buildShadow, buildShadow, buildShadow, buildColor, buildShadow, buildShadow, buildShadow, buildShadow, buildColor, buildShadow, buildShadow, buildShadow, buildShadow, buildColor],
    [buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor],
    [buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor, buildWindowColor, buildWindowColor, buildWindowColor, buildWindowColor, buildColor],
    [buildColor, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildColor, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildColor, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildWindowBorder, buildColor],
    [buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor, buildColor],
];
