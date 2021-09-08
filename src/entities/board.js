import { BoardObject } from "../objects/board-object";
import { GameVariables } from "../game-variables";
import { rectCollision } from "../utilities/collision-utilities";

export class Board {

    constructor(mainDiv) {
        this.board = [];
        this.boardCollisionObjs = [];

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'gameBoard';
        mainDiv.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;

        this.initBoard();
    }

    initBoard() {
        this.canvas.width = GameVariables.boardRealSize;
        this.canvas.height = GameVariables.boardRealSize;
        for (let y = 0; y < GameVariables.boardSize; y++) {
            let newBoardRow = [];
            for (let x = 0; x < GameVariables.boardSize; x++) {
                const isEdge = y === 0 || y === GameVariables.boardSize - 1 || x === 0 || x === GameVariables.boardSize - 1;
                const isBuild = x % 2 === 0 && y % 2 === 0;
                const currentBlockType = isEdge || isBuild ? 1 : 0;
                const boardObj = new BoardObject(x * GameVariables.boardSpriteSize, y * GameVariables.boardSpriteSize, GameVariables.boardSpriteSize, GameVariables.boardSpriteSize, currentBlockType);
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
            this.drawBuilding(boardObj);
        } else {
            this.drawFloor(boardObj);
        }
    }

    drawBuilding(boardObj) {
        const buildPixelWidth = boardObj.w / GameVariables.originalHalfSprite;
        const buildPixelHeight = boardObj.h / GameVariables.originalHalfSprite;
        for (let y = 0; y < buildingTile.length; y++) {
            for (let x = 0; x < buildingTile[y].length; x++) {
                const currentColor = buildingTile[y][x];
                if (currentColor) {
                    this.context.beginPath();
                    this.context.fillStyle = currentColor;
                    this.context.fillRect(
                        boardObj.x + (x * buildPixelWidth),
                        boardObj.y + (y * buildPixelHeight),
                        buildPixelWidth, buildPixelHeight);
                }
            }
        }
    }

    drawFloor(boardObj) {
        const floorPixelWidth = boardObj.w / GameVariables.originalSpriteSize;
        const floorPixelHeight = boardObj.h / GameVariables.originalSpriteSize;
        for (let yMultiplier = 0; yMultiplier < 2; yMultiplier++) {
            const yTilePosition = yMultiplier * (boardObj.h / 2);
            for (let xMultiplier = 0; xMultiplier < 2; xMultiplier++) {
                const xTilePosition = xMultiplier * (boardObj.w / 2);
                for (let y = 0; y < floorTile.length; y++) {
                    for (let x = 0; x < floorTile[y].length; x++) {
                        const currentColor = floorTile[y][x];
                        if (currentColor) {
                            this.context.beginPath();
                            this.context.fillStyle = currentColor;
                            this.context.fillRect(
                                xTilePosition + boardObj.x + (x * floorPixelWidth),
                                yTilePosition + boardObj.y + (y * floorPixelHeight),
                                floorPixelWidth, floorPixelHeight);
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
        const movingObjBoardPosX = Math.round( (this.board.length * movingObject.x) / GameVariables.boardRealSize);
        const movingObjBoardPosY = Math.round( (this.board.length * movingObject.y) / GameVariables.boardRealSize);
        const minXValue = movingObjBoardPosX - 1 <= 0 ? 0 : movingObjBoardPosX - 1;
        const maxXValue = movingObjBoardPosX + 1 >= this.board.length - 1 ? this.board.length - 1 : movingObjBoardPosX + 1;
        const minYValue = movingObjBoardPosY - 1 <= 0 ? 0 : movingObjBoardPosY - 1;
        const maxYValue = movingObjBoardPosY + 1 >= this.board.length - 1 ? this.board.length - 1 : movingObjBoardPosY + 1;
        for (let y = minYValue; y <= maxYValue; y++) {
            for (let x = minXValue; x <= maxXValue; x++) {
               if(this.board[y][x].objType === 1 && rectCollision(this.board[y][x], movingObject)){
                return true;
               }
            }
        }
        return false;
    }

    getBoard() {
        return this.board;
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
