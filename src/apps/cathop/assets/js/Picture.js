/**
 */
//
import * as a from "./util.js";
import { Loop, Rectangle, Point } from "./remote.js";
//
export class CH_Picture {
    constructor(img) {
        this.img = img;
        this.pos = new Point();
    }
    width() {
        return this.img.width;
    }
    height() {
        return this.img.height;
    }
    draw() {
        // abstact
    }
    getBoundingRect() {
        return new Rectangle(this.pos.x, this.pos.y, this.img.width, this.img.height);
    }
}
//
export class CH_PictureStatic extends CH_Picture {
    constructor(img) {
        super(img);
    }
    draw(x, y) {
        a.pen.drawImage(this.img, 0, 0, this.width(), this.height(), x, y, this.width(), this.height());
    }
}
//
export class CH_PictureAnimated extends CH_Picture {
    constructor(img, frameC, wait, maxLoopFrame) {
        super(img);
        this.fc = frameC;
        this.fw = this.img.width / this.fc;
        this.loop = new Loop(0, (maxLoopFrame || frames - 1) - 1, 0);
        this.delay = new Loop(0, (wait || 1), 0);
    }
    update() {
        this.delay.inc();
        if (this.delay.value === 0)
            this.loop.inc();
    }
    draw(x, y) {
        let im = this.img;
        let s = 1;
        a.pen.drawImage(im, this.fw * this.loop.value, 0, this.fw, im.height, Math.floor(x), Math.floor(y), this.fw * s, im.height * s);
    }
    getBoundingRect() {
        return new Square(0, 0, this.fw, this.img.height);
    }
}
