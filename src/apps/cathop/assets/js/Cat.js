/**
 */
//
import * as a from "./util.js";
import { CH_PictureAnimated } from "./Picture.js";
import { Point } from "./remote.js";
//
export class Cat extends CH_PictureAnimated {
    constructor(img) {
        super(img, 6, 5, 4);
        this.pos = new Point(50, 50);
        this.vel = new Point(0, 0);
        this._isJumping = false;
    }
    update() {
        this.pos.add(this.vel);
        if (!(this._isOnOrBelowGround())) {
            if (this._isJumping) a.b.gravity = 0.5;
            else a.b.gravity = 1;
            this.vel.y += a.b.gravity;
            this.vel.y = Math.min(10, this.vel.y);
        }
        else {
            this.pos.y = a.g - this.img.height;
            this.vel.y = 0;
            this._animate();
        }
    }
    _animate() {
        super.update();
    }
    draw() {
        super.draw(...this.pos.spread());
    }
    _isOnOrBelowGround() {
        return this.pos.y >= a.g - this.img.height;
    }
    _jumpStart() {
        if (this._isOnOrBelowGround()) {
            this._isJumping = true;
            this.vel.y = -10;
            this.loop.value = 4;
        }
    }
    _jumpEnd() {
        this._isJumping = false;
    }
}
