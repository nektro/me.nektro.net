/**
 */
//
import * as a from "./util.js";
//
export class CH_Game {
    constructor() {
        this.states = new Array();
        this.activeState = null;
        this.transitioner = new (class {
            // saved for later https://stackoverflow.com/a/6271865/5203655
            constructor(g) {
                this.value = 0;
                this.end = 30;
                this.runState = 0;
                // 0: not running
                // 1: running and in transition
                // 2: running and done
                this.gameref = g;
            }
            update() {
                if (this.runState === 1) {
                    this.value += 1;
                    if (this.value > this.end) {
                        this.runState += 1;
                        this.gameref.gotoState(this.doneid);
                    }
                }
            }
            draw() {
                const rw = a.w * this.value / this.end;
                const rh = a.h * this.value / this.end;
                a.pen.drawRect(a.w/2 - rw/2, a.h/2 - rh/2, rw, rh, 'fill', 'black')
            }
            goto(sid) {
                this.runState = 1;
                this.doneid = sid;
            }
            stop() {
                this.runState = 0;
                this.value = 0;
            }
        })(this);
    }
    addState(st) {
        if (st.id === undefined) throw new Error('GameStates must have an ID');
        this.states.push(st);
    }
    run() {
        let ast = this.activeState;
        this.transitioner.update();
        ast.update();
        a.pen.clear();
        ast.draw();
        this.transitioner.draw();
        if (this.transitioner.runState === 2) this.transitioner.stop();
        requestAnimationFrame(this.run.bind(this));
    }
    start() {
        if (navigator.userAgent.indexOf('Mobile') > -1) {
            window.addEventListener('touchstart', (e) => { if (!(this.transitioner.runState > 0)) this.activeState.clickDown(e); });
            window.addEventListener('touchend', (e) => { if (!(this.transitioner.runState > 0)) this.activeState.clickUp(e); });
        }
        else {
            window.addEventListener('mousedown', (e) => { if (!(this.transitioner.runState > 0)) this.activeState.clickDown(e); });
            window.addEventListener('mouseup', (e) => { if (!(this.transitioner.runState > 0)) this.activeState.clickUp(e); });
        }
        this.gotoState(this.states[0].id);
        this.run();
    }
    gotoState(id) {
        this.activeState = this.states.find(x => x.id === id);
        if (this.activeState === undefined) throw new Error(`Cannot find GameState with ID of ${id}`);
        this.activeState.init();
    }
    transitionTo(id) {
        this.transitioner.goto(id);
    }
}
//
export class CH_GameState {
    constructor(id) {
        this.id = id;
    }
    init() {}
    update() {}
    draw() {}
    clickDown() {}
    clickUp() {}
}
