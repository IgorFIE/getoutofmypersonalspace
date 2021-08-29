import { GameVariables } from "./game-variables";
import { rectCollision } from "./collision-utilities";

export const convertGeneralPosToBoardPos = (obj, board) => {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const currentBoardObj = board[y][x];
            if (rectCollision(obj, currentBoardObj)) {
                return { x: x, y: y };
            }
        }
    }
    return { x: 0, y: 0 };
}

export const convertBoardPosToGeneralPos = (value) => {
    const boardSpriteSize = GameVariables.spriteSize * GameVariables.boardScaleMultiplier;
    const boardRealSize = boardSpriteSize * GameVariables.boardSize;
    return ((boardRealSize * value) / GameVariables.boardSize) + (boardSpriteSize / 2);
}