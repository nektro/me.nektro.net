function $$(s) {
    return document.querySelector(s);
}
function genAvatar() {
    var img = document.getElementById('images').children;
    var out = document.getElementById('output');
    var can = document.getElementById('canvas');
    var con = can.getContext('2d');
    var w = 1260;

    con.drawImage(img[0], 0, 0); // draw background
    con.drawImage(img[1], w/2 - 779/2, 600); // draw body
    con.drawImage(img[6], w/2 - 279/2, 274); // draw head

    // Array<shouldDraw,dX,dY>
    var glasses = [[0],[1,490,340],[1,490,340],[1,490,340],[1,480,318]];
    var hair = [[0],[1,470,254],[1,470,254],[1,470,204],[1,515,254],[1,480,254],[1,468,244],[1,525,244],[1,525,244],[1,520,195],[1,495,305],[1,470,234],[1,507,255],[1,500,305]];
    var beard = [[0],[1,545,420],[1,545,420],[1,492,414],[1,492,414],[1,562,444],[1,557,437],[1,552,429],[1,592,494],[1,567,454],[1,562,445],[1,557,438],[1,552,499],[1,547,449],[1,546,434],[1,502,418],[1,500,419],[1,500,414],[1,555,494],[1,550,449],[1,551,439],[1,542,429]];

    var ig = glasses[document.getElementById('glasses').value];
    var ih = hair[document.getElementById('hair').value];
    var ib = beard[document.getElementById('beard').value];
    var id = "./../../assets/img/pcmr_avatar_generator";

    if (ih[0] === 1)
        con.drawImage($$('img[src="' + id + '/hair' + hair.indexOf(ih) + '.png"]'), ih[1], ih[2]); // draw hair
    if (ib[0] === 1)
        con.drawImage($$('img[src="' + id + '/beard' + beard.indexOf(ib) + '.png"]'), ib[1], ib[2]); // draw beard
    if (ig[0] === 1)
        con.drawImage($$('img[src="' + id + '/glasses' + glasses.indexOf(ig) + '.png"]'), ig[1], ig[2]); // draw glasses

    can.toBlob(function(blob) {
        out.setAttribute('src', URL.createObjectURL(blob));
    });
}
function downloadAvatar() {
    document.getElementById('canvas').toBlob(function(blob) {
        var v = [$$('#glasses').value,$$('#hair').value,$$('#beard').value];
        saveAs(blob, "glorius_avatar_g" + v[0] + "_h" + v[1] + "_b" + v[2] + ".png");
    });
}
(function() {
    window.addEventListener('load', function() {
        genAvatar();

        $$('#glasses').addEventListener('change', function() {
            genAvatar();
        });
        $$('#hair').addEventListener('change', function() {
            genAvatar();
        });
        $$('#beard').addEventListener('change', function() {
            genAvatar();
        });
    });
})();
