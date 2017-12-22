/**
 */
//
import * as a from "./util.js";
import { CH_PictureStatic } from "./Picture.js";
import { Point } from "./remote.js";
//
export class Enemy extends CH_PictureStatic {
    constructor(img) {
        super(img);
        this.pos = new Point(a.w + Math.random() * (75 * a.b.edx / 10), a.g);
    }
    update() {
        this.pos.x -= a.b.edx / 10;
    }
    draw() {
        super.draw(...this.pos.spread());
    }
}
