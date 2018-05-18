const can = document.getElementById('canvas');
can.width = (can.parentElement.getBoundingClientRect().width - 30);
can.height = (can.width - 30);
const ctx = can.getContext('2d');
const pen = new Pencil(ctx);
const w = can.width;
const h = can.height;
const r = h / 2 - 6;
ctx.translate(w / 2, h / 2);
ctx.rotate(Math.PI / 2 * -1);
//
const dots = document.getElementById('d');
const mult = document.getElementById('m');
const share_tweet = document.getElementById('tweet');
//
if (location.hash.length > 0) {
    let a = location.hash.substring(1).split('x');
    dots.setAttribute('value', a[0]);
    mult.setAttribute('value', a[1]);
}
//
function makeCircle() {
    const d = Math.max(dots.value | 0, 10);
    const m = Math.max(mult.value | 0, 2);
    //
    pen.ctx.clearRect(-r, -r, h, h);
    pen.drawShape(new Circle(0, 0, r), 'stroke', '#eee');
    //
    const a1 = new Array(d).fill(0).map((v,i) => { return i; });
    const b = a1.map((v) => { return v / d; })
                .map((v) => { return Math.PI * 2 * v; })
                .map((v) => { return [ Math.cos(v) * r, Math.sin(v) * r ]; });
    //
    b.forEach((v) => { pen.drawShape(new Circle(v[0], v[1], 3), 'fill', 'red'); });
    //
    for (var i = 0; i < a1.length; i++) {
        let n = i * m % d;
        pen.drawLine(b[i][0], b[i][1], b[n][0], b[n][1], '#333');
    }
    //
    location.replace(`#${d}x${m}`)
    //
    let qS = encodeQueryData({
        text: `Try out modular multiplication around a cirlce @ ${location.origin}${location.pathname}${location.hash}`,
        via: 'Nektro'
    });
    share_tweet.setAttribute('href', `https://twitter.com/intent/tweet?${qS}`);
}
function encodeQueryData(data) {
    return Object.entries(data).map((v) => { return encodeURIComponent(v[0]) + '=' + encodeURIComponent(v[1]); }).join('&');
}
//
dots.addEventListener('change', makeCircle);
mult.addEventListener('change', makeCircle);
//
makeCircle();
