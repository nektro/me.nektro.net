/**
 * Cat Hop
 * (c) 2017 Sean Denny
 * Art and Music by Andrew Tran
 */
/**
 * https://developers.google.com/drive/v3/web/appdata
 */
//
import * as a from "./util.js";
import { Point, Loop, array_to_object } from "./remote.js";
import { CH_GameState } from "./Game.js";
import { CatHopGame } from "./CatHopGame.js";
import { CH_PictureStatic } from "./Picture.js";
import { Background } from "./Background.js";
import { Ground } from "./Ground.js";
import { Cat } from "./Cat.js";
import { Enemy } from "./Enemy.js";
//
const VERSION = "0.6";
const MAPS = ["city_day","city_night"];
const CATS = ["gyzmo","lilac","turkey","skater&scooter"];
//
window.addEventListener("load", async function() {
    console.log(`Starting Cat Hop v${VERSION}`);
    const maps = await Promise.all(MAPS.map(v => a.getBackground(v)));
    const cats = await Promise.all(CATS.map(v => a.getCat(v)));
    const pics = array_to_object(["logo","start","select_character","select_map","back","confirm","left","right"], await a.getAssets([
        "game/logo.png", "game/buttons/start.png",
        "game/buttons/select_character.png", "game/buttons/select_map.png",
        "game/buttons/back.png", "game/buttons/confirm.png",
        "game/buttons/left.png", "game/buttons/right.png"
    ]));
    const sfx = array_to_object(["jump","death","highscore","click"], (await a.getAssets([
        "game/sfx/jump.mp3", "game/sfx/death.mp3",
        "game/sfx/highscore.mp3", "game/sfx/select.mp3"
    ])).map(v => {
        v.loop = false;
        return v;
    }));
    const high_score = { score: 0, just_set: false };

    // set localStorage default values
    [a.ls_high_score,a.ls_map,a.ls_cat].forEach((v) => {
        if (localStorage.getItem(v) === null) {
            localStorage.setItem(v, 0);
        }
    });

    // read actual data from localStorage
    high_score.score = parseInt(localStorage.getItem(a.ls_high_score));
    const game = new CatHopGame();
    game.map = parseInt(localStorage.getItem(a.ls_map));
    game.cat = parseInt(localStorage.getItem(a.ls_cat));

    // local vars [[temp]]
    let map, background, ground, cat;
    setMap(game.map);
    setCharacter(game.cat);
    let enemies = new Array();
    let score = 0;
    let fc = 0;

    // local functions [[temp]]
    function drawScore() {
        const dc = parseInt(Math.log10(score) % 10 + 1); // digit count
        a.pen.drawText(10, 55, "fill", `${score}`, "white", `36px "${a.font_p}"`);
        a.pen.drawText(10, 80, "fill", `Top: ${high_score.score}`, "white", `12px "${a.font_p}"`);
    }
    function setHighScore(new_score) {
        high_score.score = new_score;
        localStorage.setItem(a.ls_high_score, new_score);
    }
    function setMap(id) {
        game.map = id;
        map = maps[game.map];
        background = new Background(map[0], map[1]);
        ground = new Ground(map[2]);
        localStorage.setItem(a.ls_map, id);
    }
    function setCharacter(id) {
        game.cat = id;
        cat = new Cat(cats[game.cat][0]);
        localStorage.setItem(a.ls_cat, id);
    }

    // setup game states

    // // title screen
    game.addState(new (class extends CH_GameState {
        constructor() {
            super("title");
            this.logo = new CH_PictureStatic(pics.logo);
            this.logo.pos = new Point(a.w / 2 - this.logo.width() / 2, a.h * .1);
            this.start_button = new CH_PictureStatic(pics.start);
            this.start_button.pos = new Point(a.w / 2 - this.start_button.width() / 2, this.logo.pos.y + this.logo.height() + (50 * a.r));
            this.select_character = new CH_PictureStatic(pics.select_character);
            let midcen = new Point(a.w / 2, (this.start_button.pos.y + this.start_button.height() + a.h) / 2);
            this.select_character.pos = midcen.clone().sub(new Point(this.select_character.width() + a.r * 15, this.select_character.height() / 2));
            this.select_map = new CH_PictureStatic(pics.select_map);
            this.select_map.pos = midcen.clone().sub(new Point(a.r * -15, this.select_map.height() / 2));
        }
        init() {
            high_score.just_set = false;
            cat.loop.value = 0;
            cat.pos.x = 50 * a.r;
            cat.pos.y = a.g - cat.img.height;
            enemies.clear();
            a.b.edx = Math.round(30 * a.rr.v);
            a.b.gravity = 1 * a.r;
            score = 0;
            fc = -1;
        }
        update() {
            background.update();
            ground.update();
            cat.update();
        }
        draw() {
            background.draw();
            ground.draw();
            cat.draw();
            this.logo.draw(...this.logo.pos.spread());
            this.start_button.draw(...this.start_button.pos.spread());
            this.select_character.draw(...this.select_character.pos.spread());
            this.select_map.draw(...this.select_map.pos.spread());
            a.pen.drawText(5, a.h - 5, "fill", `(c) Sean Denny 2018, v${VERSION}`, "white", `10px "${a.font_p}"`);
        }
        clickDown(e) {
            const { clientX, clientY } = (e.__proto__.constructor === MouseEvent ? e : e.changedTouches[0]); // click event position
            const click = new Point(clientX, clientY);
            if (this.start_button.getBoundingRect().intersects(click)) {
                sfx.click.play();
                game.gotoState("game");
            }
            if (this.select_character.getBoundingRect().intersects(click)) {
                sfx.click.play();
                game.transitionTo("character_select");
            }
            if (this.select_map.getBoundingRect().intersects(click)) {
                sfx.click.play();
                game.transitionTo("map_select");
            }
        }
    })());

    // // actual game
    game.addState(new (class extends CH_GameState {
        constructor() {
            super("game");
        }
        init() {
            a.audio_controller.start(map[4]);
        }
        update() {
            fc += 1;
            background.update();
            ground.update();
            cat.update();
            //
            if (enemies.length == 0 || enemies.last().pos.x < a.w - (200 * a.r)) {
                enemies.push(new Enemy(map[3]));
            }
            //
            enemies.forEach((v) => {
                v.update();
            });
            //
            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i] === undefined) continue;
                let en = enemies[i];
                if (cat._isOnOrBelowGround()) {
                    if ((cat.pos.x + cat.fw) - en.pos.x > cat.fw * .25 && cat.pos.x < en.pos.x) this._die();
                    if ( (en.pos.x + en.fw) - cat.pos.x > cat.fw * .25 && cat.pos.x > en.pos.x) this._die();
                }
            }
            //
            if (enemies.length > 0)
                if (enemies[0].pos.x < -80)
                    enemies.shift();
            //
            if (fc === 50) {
                a.b.edx += 1;
                fc = 0;
            }
            if (fc % 25 === 0) {
                score += 1;
            }
        }
        draw() {
            background.draw();
            ground.draw();
            enemies.forEach((v) => { v.draw(); });
            cat.draw();
            drawScore();
        }
        clickDown() {
            cat._jumpStart();
            sfx.jump.play();
        }
        clickUp() {
            cat._jumpEnd();
        }
        _die() {
            cat.loop.value = 5;
            console.log(`dead, score: ${score}, difficulty: ${a.b.edx / 10}`);
            a.audio_controller.stop(map[4]);
            if (score > high_score.score) {
                high_score.just_set = true;
                sfx.highscore.play();
            }
            else {
                sfx.death.play();
            }
            game.gotoState("death_score");
        }
    })());

    // // death score screen
    game.addState(new (class extends CH_GameState {
        constructor() {
            super("death_score");
            this.new_highscore = new CH_PictureStatic(document.getElementById("i_new_highscore"));
            this.new_highscore.pos = new Point(a.w / 2 - this.new_highscore.img.width / 2, a.h * .1);
            this.replay_button = new CH_PictureStatic(document.getElementById("i_replay_button"));
            this.replay_button.pos = new Point(a.w / 2 - this.replay_button.img.width / 2, this.new_highscore.pos.y + this.new_highscore.height() + (50 * a.r));
        }
        draw() {
            background.draw();
            ground.draw();
            enemies.forEach((e) => { e.draw(); });
            cat.draw();
            drawScore();
            this.replay_button.draw(...this.replay_button.pos.spread());

            if (high_score.just_set) {
                this.new_highscore.draw(...this.new_highscore.pos.spread());
            }
        }
        clickUp(e) {
            const {clientX, clientY} = (e.__proto__.constructor === MouseEvent ? e : e.changedTouches[0]); // click event position
            if (this.replay_button.getBoundingRect().intersects(new Point(clientX,clientY))) {
                if (high_score.just_set) setHighScore(score);
                enemies = [];
                sfx.click.play();
                game.gotoState("title");
            }
        }
    })());

    const margin = a.r * 10;
    const btn_back = new CH_PictureStatic(pics.back);
    btn_back.pos = new Point(margin, margin);
    const btn_confirm = new CH_PictureStatic(pics.confirm);
    btn_confirm.pos = new Point(a.w / 2 - btn_confirm.width() / 2, a.h - margin - btn_confirm.height());
    const btn_left = new CH_PictureStatic(pics.left);
    btn_left.pos = new Point(a.w / 2 - btn_confirm.width() / 2 - margin - btn_left.width(), a.h - margin - btn_left.height());
    const btn_right = new CH_PictureStatic(pics.right);
    btn_right.pos = new Point(a.w / 2 + btn_confirm.width() / 2 + margin, a.h - margin - btn_right.height());

    // map select
    game.addState(new (class extends CH_GameState {
        constructor() {
            super("map_select");
            this.i = new Loop(0, maps.length - 1, 0);
            this.temp = [];
        }
        init() {
            this.i.value = game.map;
            this._updateTempMap();
        }
        _updateTempMap() {
            if (this.temp.length > 0)
                a.audio_controller.stop(this.temp[2]);
            const mp = maps[this.i.value];
            this.temp = [ new Background(mp[0], mp[1]), new Ground(mp[2]), mp[4] ];
            a.audio_controller.start(this.temp[2]);
        }
        draw() {
            this.temp[0].draw();
            this.temp[1].draw();
            btn_back.draw(...btn_back.pos.spread());
            btn_confirm.draw(...btn_confirm.pos.spread());
            btn_left.draw(...btn_left.pos.spread());
            btn_right.draw(...btn_right.pos.spread());
        }
        clickUp(e) {
            const { clientX, clientY } = (e.__proto__.constructor === MouseEvent ? e : e.changedTouches[0]); // click event position
            const click = new Point(clientX, clientY);
            if (btn_back.getBoundingRect().intersects(click)) {
                a.audio_controller.stop(this.temp[2]);
                sfx.click.play();
                game.transitionTo("title");
            }
            if (btn_right.getBoundingRect().intersects(click)) {
                sfx.click.play();
                this.i.inc();
                this._updateTempMap();
            }
            if (btn_left.getBoundingRect().intersects(click)) {
                sfx.click.play();
                this.i.dec();
                this._updateTempMap();
            }
            if (btn_confirm.getBoundingRect().intersects(click)) {
                setMap(this.i.value);
                a.audio_controller.stop(this.temp[2]);
                sfx.click.play();
                game.transitionTo("title");
            }
        }
    })());

    // character select
    game.addState(new (class extends CH_GameState {
        constructor() {
            super("character_select");
            this.i = new Loop(0, cats.length - 1, 0);
        }
        init() {
            this.i.value = game.cat;
            this._updateTempChar();
        }
        update() {
            this.temp._animate();
        }
        draw() {
            background.draw();
            ground.draw();
            btn_back.draw(...btn_back.pos.spread());
            btn_left.draw(...btn_left.pos.spread());
            btn_confirm.draw(...btn_confirm.pos.spread());
            btn_right.draw(...btn_right.pos.spread());
            this.temp.draw();
        }
        _updateTempChar() {
            this.temp = new Cat(cats[this.i.value][0]);
            this.temp.pos.x = a.w / 2 - this.temp.width() / this.temp.fc / 2;
            this.temp.pos.y = a.g - this.temp.height();
        }
        clickUp(e) {
            const { clientX, clientY } = (e.__proto__.constructor === MouseEvent ? e : e.changedTouches[0]); // click event position
            const click = new Point(clientX, clientY);
            if (btn_back.getBoundingRect().intersects(click)) {
                sfx.click.play();
                game.transitionTo("title");
            }
            if (btn_right.getBoundingRect().intersects(click)) {
                sfx.click.play();
                this.i.inc();
                this._updateTempChar();
            }
            if (btn_left.getBoundingRect().intersects(click)) {
                sfx.click.play();
                this.i.dec();
                this._updateTempChar();
            }
            if (btn_confirm.getBoundingRect().intersects(click)) {
                sfx.click.play();
                setCharacter(this.i.value);
                game.transitionTo("title");
            }
        }
    })());

    //
    document.getElementById("loader").remove();
    game.start();
});
//
