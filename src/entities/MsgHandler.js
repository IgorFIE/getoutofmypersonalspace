import { GameVariables } from "../game-variables";
import { convertTextToPixelArt, drawPixelTextInCanvasContext } from "../utilities/text";
import { randomNumberOnRange } from "../utilities/util";

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
        this.itemMsgPosition = (GameVariables.gameHeight / 2) - ((GameVariables.oneEighthSprite * 19) * (GameVariables.pixelMulpiplier / 2));

        this.eventTimer = 0;
        this.wasEventMsgDraw = true;
        this.wasEventMsgClean = true;
        this.eventMsgPosition = 146 + GameVariables.pixelMulpiplier * 2;

        this.wasMonitizationMsgDraw = false;
    }

    updateItemMsg(newItemMsg) {
        this.cleanItemMsg();
        this.itemMsg = newItemMsg;
        this.itemTimer = 0
        this.wasItemMsgDraw = false;
        this.wasItemMsgClean = false;
    }

    updateEventMsg() {
        this.eventTimer = 0
        this.wasEventMsgDraw = false;
        this.wasEventMsgClean = false;
    }

    cleanItemMsg() {
        this.context.clearRect(0, this.itemMsgPosition - (GameVariables.pixelMulpiplier * 3), GameVariables.gameWidth, GameVariables.pixelMulpiplier * 6);
    }

    cleanEventMsg() {
        this.context.clearRect(0, this.eventMsgPosition - (GameVariables.pixelMulpiplier * 6), GameVariables.gameWidth, GameVariables.pixelMulpiplier * 12);
    }

    drawMsgs(secondsPassed) {
        this.drawItemMsg(secondsPassed);
        this.drawEventMsg(secondsPassed);
        this.drawMonetizationMsg();
    }

    drawItemMsg(secondsPassed) {
        if (!this.wasItemMsgDraw) {
            this.wasItemMsgDraw = true;
            const itemMsg = convertTextToPixelArt(this.itemMsg);
            drawPixelTextInCanvasContext(itemMsg, this.canvas, GameVariables.pixelMulpiplier, this.itemMsgPosition);
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

    drawEventMsg(secondsPassed) {
        if (!this.wasEventMsgDraw) {
            this.wasEventMsgDraw = true;
            const eventMsg = convertTextToPixelArt(eventMessages[randomNumberOnRange(0, eventMessages.length - 1)]);
            drawPixelTextInCanvasContext(eventMsg, this.canvas, GameVariables.pixelMulpiplier * 2, this.eventMsgPosition);
        } else {
            if (!this.wasEventMsgClean) {
                this.eventTimer += secondsPassed;
                if (this.eventTimer > GameVariables.eventMsgDisplayTimer) {
                    this.cleanEventMsg();
                    this.wasEventMsgClean = true;
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

const eventMessages = [
    'pubs now open!', 'lockdown easing!', 'Football match!', 
    'summer holidays!', 'nightclubs open!', 'music festival!', 
    'BBQ season!', 'movie night!', 'board game events!', 
    'js13k!', 'E3!', 'Black Friday!'];