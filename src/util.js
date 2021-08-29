import { GameVariables } from "./game-variables";

export const convertGeneralPosToBoardPos = (value) => {
    const boardRealSize = GameVariables.spriteSize * GameVariables.boardScaleMultiplier * GameVariables.boardSize;
    const playerBoardPos = (GameVariables.boardSize * value) / -boardRealSize;
    if (playerBoardPos < 1) {
        return 1;
    } else if (playerBoardPos > GameVariables.boardSize - 2) {
        return GameVariables.boardSize - 2;
    } else {
        return  Math.round(playerBoardPos); // need to revisit this, sometimes the player dot goes inside the builds
    }
}

export const convertBoardPosToGeneralPos = (value) => {
    const boardSpriteSize = GameVariables.spriteSize * GameVariables.boardScaleMultiplier;
    const boardRealSize = boardSpriteSize * GameVariables.boardSize;
    return ((boardRealSize * value) / GameVariables.boardSize) + (boardSpriteSize / 2);
}