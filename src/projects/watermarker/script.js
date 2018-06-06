/**
 */
//
import { read } from "https://cdn.rawgit.com/Nektro/modules.js/04673d0/src/read.js";
import { saveAs } from "https://cdn.rawgit.com/eligrey/FileSaver.js/e865e37/src/FileSaver.js";

//
document.getElementById("go").addEventListener("click", function() {
    const images = document.getElementById("images").files;
    const marker = document.getElementById("mark").files[0];
    //
    document.getElementById("app").children[2].children[2].removeAttribute("hidden");
    document.getElementById("app").children[2].children[1].setAttribute("disabled","");
    //
    const things = Promise.all([
        document.getElementById("mark").files[0],
        ...document.getElementById("images").files
    ]
    .map(x => {
        return new Promise(resolve => {
            const can = document.createElement("canvas");
            const ctx = can.getContext("2d");
            const img = new Image();
            //
            img.addEventListener("load", function() {
                can.setAttribute("data-name", x.name);
                can.setAttribute("width", img.width);
                can.setAttribute("height", img.height);
                ctx.drawImage(img, 0, 0);
                // URL.revokeObjectURL(img.src);
                resolve(can);
            });
            img.src = URL.createObjectURL(x);
        });
    }));
    (async function() {
        const [ wmk, ...imgs ] = await things;
        const zip = new JSZip();
        //
        Promise.all(imgs.map(i => {
            return new Promise(resolve => {
                const c = i.getContext("2d");
                c.drawImage(wmk, i.width - wmk.width, i.height - wmk.height);
                i.toBlob(blob => {
                    zip.file(i.dataset.name, blob);
                    resolve();
                })
            });
        }))
        .finally(() => {
            zip.generateAsync({ type:"blob" })
            .then(content => {
                saveAs(content, "watermarker-" + Date.now() + ".zip");
                document.getElementById("app").children[2].children[2].setAttribute("hidden","");
                document.getElementById("app").children[2].children[1].removeAttribute("disabled");
            });
        })
    })();
});
