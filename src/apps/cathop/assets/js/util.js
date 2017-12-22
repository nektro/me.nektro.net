/**
 */
//
import { Pencil } from "./remote.js";
//
export const can = document.getElementById('screen');
export const con = can.getContext('2d');
export const pen = new Pencil(con);
export const dw = can.width;
export const dh = can.height;
export const w = window.innerWidth;
export const h = window.innerHeight;
can.setAttribute('width', w);
can.setAttribute('height', h);
con.imageSmoothingEnabled = false;
export const r = h / dh;
export const rr = {
    v: h / dh,
    h: w / dw
};
export const g = h - (65 * rr.v);
export const ls_high_score = `apps.cathop.high_score`;
export const ls_map = `apps.cathop.map`;
export const ls_cat = `apps.cathop.cat`;
export const font_p = `Pixeled`;
export const font_w = `8-bit Wonder`;
//
export const b = {
    edx: 60,
    gravity: 1
};
//
export const audio_controller = {
    start: function(audio) {
        audio = audio;
        audio.play();
    },
    stop: function(audio) {
        if (audio !== null) {
            audio.currentTime = 0;
            audio.pause();
        }
    }
};
//
function auto_scale_image(image) {
    let nw = Math.floor(image.width * r);
    let nh = Math.floor(image.height * r);
    nw -= nw % 6;
    let offcan = document.createElement('canvas'); // = new OffscreenCanvas(nw, nh);
    offcan.setAttribute('width', nw);
    offcan.setAttribute('height', nh);
    let offcon = offcan.getContext('2d');
    offcon.imageSmoothingEnabled = false;
    offcon.drawImage(image, 0, 0, image.width, image.height, 0, 0, nw, nh);
    return offcan;
}
//
export function getAsset(asst) {
    return fetch(`assets/${asst}`)
    .then(x => x.blob())
    .then(x => {
        switch (asst.split('.').pop()) {
            case 'png': {
                return blob_to_image(x)
                .then(y => auto_scale_image(y));
            }
            case 'mp3': {
                return blob_to_audio(x);
            }
        }
        return Promise.reject('Attempted to retrieve asset of unknown type');
    });
}
//
export function getAssets(aou) {
    return Promise.all(aou.map((v) => getAsset(v)));
}
//
export function getBackground(id) {
    return getAssets(['parallax.png','background.png','ground.png','hole.png','bgm.mp3'].map(v => `game/maps/${id}/${v}`));
}
//
export function getCat(id) {
    return getAssets([`game/cats/${id}.png`]);
}
//
export function blob_to_image(blob) {
    if ('createImageBitmap' in self) {
        return createImageBitmap(blob);
    }
    else {
        return new Promise((resolve,reject) => {
            let img = document.createElement('img');
            img.addEventListener('load', function() {
                resolve(this);
            });
            img.src = URL.createObjectURL(blob);
        });
    }
}
//
export function blob_to_audio(blob) {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.loop = true;
    return audio;
}
