import { GameVariables } from "../game-variables";
import { rectCollision } from "./collision-utilities";

export const generalRectToBoardRect = (rect, board) => {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const currentBoardRect = board[y][x];
            if (rectCollision(rect, currentBoardRect)) {
                return { x: x, y: y };
            }
        }
    }
    return { x: 0, y: 0 };
}

export const boardPosToGeneralPos = (boardPosValue) => {
    return ((GameVariables.boardRealSize * boardPosValue) / GameVariables.boardSize) + (GameVariables.boardSpriteSize / 2);
}

export const randomNumberOnRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}