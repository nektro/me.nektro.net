/**
 */
//
import * as a from "./util.js";
import { CH_PictureStatic } from "./Picture.js";
import { Point } from "./remote.js";
//
export class Background {
    constructor(pa, bg) {
        this.imgp = new CH_PictureStatic(pa);
        this.imgb = new CH_PictureStatic(bg);
        
        this.posp = new Point(this.imgp.width());
        this.posb = new Point(this.imgb.width());
    }
    update() {
        if (this.posp.x <= 0) this.posp.x += this.imgp.width(); // loop parallax texture
        if (this.posb.x <= 0) this.posb.x += this.imgb.width(); // loop background texture

        this.posp.x -= ((a.b.edx / 10) / 3);
        this.posb.x -= (a.b.edx / 10);
    }
    draw() {
        this.imgp.draw(this.posp.x - this.imgp.width(), 0, 1);
        this.imgp.draw(this.posp.x, 0, 1);

        this.imgb.draw(this.posb.x - this.imgb.width(), 0, 1);
        this.imgb.draw(this.posb.x, 0, 1);
    }
}
