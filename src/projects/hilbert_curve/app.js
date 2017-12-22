const can = document.getElementById('canvas');
can.setAttribute('width', can.parentElement.clientWidth - 30);
can.setAttribute('height', can.width);
const ctx = can.getContext('2d');
const pen = new Pencil(ctx);
const w = can.width;
const h = can.height;
ctx.translate(0, h);
ctx.scale(1, -1);
//
const inp = document.getElementById('d');
//
function fi(a) {
    return a == true;
}
function not(a) {
    return !(fi(a));
}
function and(a,b) {
    return fi(a) === fi(b);
}
function or(a,b) {
    return fi(a) || fi(b);
}
function xor(a,b) {
    //if( ( foo && !bar ) || ( !foo && bar ) ) {
    return or(and(a,not(b)),and(not(a),b));
}
function makeCurve() {
    const o = Math.max(inp.value | 0, 1);
    const l = Math.pow(2, 2 * o);
    //
    pen.clear();
    //
    const r1 = new Array(l).fill(0)
                .map((v,i) => { return i; })
                .map(hilbert(o))
                .map((v) => { return v.map((v2) => { return v2 / (Math.pow(2,o)-1); }); })
                .map((v) => { return v.map((v2) => { return v2 * w; }); })
                .map((v) => { return new Point(...v); });
    pen.drawPolygon(r1, 'red', 'stroke');
}
//
makeCurve();
//
inp.addEventListener('change', () => { makeCurve(); });
