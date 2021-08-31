import { SquareObject } from "./square-object";

export class BoardObject extends SquareObject {
    constructor(x, y, w, h, objType) {
        super(x,y,w,h);
        this.objType = objType;
    }
}