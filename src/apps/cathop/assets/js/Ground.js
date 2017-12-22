/**
 */
//
import * as a from "./util.js";
import { CH_PictureStatic } from "./Picture.js";
import { Point } from "./remote.js";
//
export class Ground {
    constructor(img) {
        this.img = new CH_PictureStatic(img);
        this.pos = new Point(this.img.width(), a.g);
    }
    update() {
        if (this.pos.x <= 0) this.pos.x += this.img.width();
        this.pos.x -= (a.b.edx / 10);
    }
    draw() {
        this.img.draw(this.pos.x - this.img.width(), this.pos.y, 1);
        this.img.draw(...this.pos.spread(), 1);
    }
}
