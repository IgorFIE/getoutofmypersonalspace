import { GameVariables } from "../game-variables";
import { convertTextToPixelArt, drawPixelTextInCanvasContext } from "../utilities/text";

export class MsgHandler {
    constructor(mainDiv) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'msgHandler';
        this.canvas.width = GameVariables.gameWidth;
        this.canvas.height = GameVariables.gameHeight;
        mainDiv.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;

        this.itemMsg = '';
        this.itemTimer = 0;
        this.wasItemMsgDraw = true;
        this.wasItemMsgClean = true;
        this.itemPosition = (GameVariables.gameHeight / 4) + (GameVariables.pixelMulpiplier * 9)

        this.wasMonitizationMsgDraw = false;
    }

    updateItemMsg(newItemMsg) {
        this.cleanItemMsg();
        this.itemMsg = newItemMsg;
        this.itemTimer = 0
        this.wasItemMsgDraw = false;
        this.wasItemMsgClean = false;
    }

    cleanItemMsg() {
        this.context.clearRect(0, this.itemPosition - (GameVariables.pixelMulpiplier * 3), GameVariables.gameWidth, GameVariables.pixelMulpiplier * 6);
    }

    drawMsgs(secondsPassed){
        this.drawItemMsg(secondsPassed);
        this.drawMonetizationMsg();
    }

    drawItemMsg(secondsPassed) {
        if (!this.wasItemMsgDraw) {
            this.wasItemMsgDraw = true;
            const itemMsg = convertTextToPixelArt(this.itemMsg);
            drawPixelTextInCanvasContext(itemMsg, this.canvas, GameVariables.pixelMulpiplier, this.itemPosition);
        } else {
            if (!this.wasItemMsgClean) {
                this.itemTimer += secondsPassed;
                if (this.itemTimer > GameVariables.msgDisplayTimer) {
                    this.cleanItemMsg();
                    this.wasItemMsgClean = true;
                }
            }
        }
    }

    drawMonetizationMsg() {
        if (!this.wasMonitizationMsgDraw && GameVariables.monetizationActive) {
            const monetizationMsg = convertTextToPixelArt('Subscription Activated! Extra anxiety tolerance and healing!');
            drawPixelTextInCanvasContext(monetizationMsg, this.canvas, Math.ceil(GameVariables.pixelMulpiplier / 2), GameVariables.gameHeight - 28 - (GameVariables.pixelMulpiplier * 2));
            this.wasMonitizationMsgDraw = true;
        }
    }
}