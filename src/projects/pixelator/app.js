(function() {
    Uint8ClampedArray.prototype.copy = function() {
        var a = new Uint8ClampedArray(this.length);
        for (var i = 0; i < this.length; i++) {
            a[i] = this[i];
        }
        return a;
    };
    document.getElementById('file').addEventListener('change', function(e) {
        window.p = window.p || {};
        
        p.f = e.currentTarget.files[0];
        p.c = document.getElementById('can');
        p.o = p.c.getContext('2d');
        
        var im = new Image();
        im.src = window.URL.createObjectURL(p.f);
        im.addEventListener('load', function(g) {
            p.c.setAttribute('width', this.width);
            p.c.setAttribute('height', this.height);
            p.o.drawImage(this, 0, 0);
            p.w = this.width;
            p.h = this.height;
            p.d = p.o.getImageData(0, 0, p.w, p.h).data;
            p.b = p.d.copy();
            //console.log(p);
            
            document.getElementById('btn_restore').addEventListener('click', function(h) {
                p.o.putImageData(new ImageData(p.b, p.w, p.h), 0, 0);
                p.d = p.o.getImageData(0, 0, p.w, p.h).data;
            });
        });
        
        // filter name, parameters array, pre image data
        window.getFilterOutput = function(n,a,d) {
            switch (n) {
                case 'invert':
                    for (var i = 0; i < d.length; i++) {
                        switch (i % 4) {
                            case 0:
                            case 1:
                            case 2: d[i] = 255 - d[i]; break;
                            case 3: d[i] = 255; break;
                        }
                    }
                break;
                
                case 'grayscale':
                    for (var i = 0; i < d.length; i++) {
                        switch (i % 4) {
                            case 3:
                                var r = d[i-3];
                                var g = d[i-2];
                                var b = d[i-1];
                                var v = 0.2126*r + 0.7152*g + 0.0722*b;
                                d[i-3] = d[i-2] = d[i-1] = v;
                            break;
                        }
                    }
                break;
                
                case 'brighten':
                    for (var i = 0; i < d.length; i++) {
                        switch (i % 4) {
                            case 0:
                            case 1:
                            case 2:
                                d[i] += a[0];
                            break;
                        }
                    }
                break;
                
                case 'threshold':
                    applyFilter('grayscale');
                    for (var i = 0; i < d.length; i++) {
                        switch (i % 4) {
                            case 3:
                                // only check red because grayscale normalized pixels
                                var v = d[i-2] > a[0] ? 255 : 0
                                d[i-3] = d[i-2] = d[i-1] = v;
                            break;
                        }
                    }
                break;
                
                case 'convolute':
                    var side = Math.round(Math.sqrt(a.length));
                    var hside = Math.floor(side / 2);
                    var out = p.o.createImageData(p.w, p.h).data;
                    var w = p.w;
                    var h = p.h;
                    
                    for (var y = 0; y < h; y++) {
                        for ( var x = 0; x < w; x++) {
                            var dst = (y * w + x) * 4;
                            var r=0, g=0, b=0, l=0;
                            
                            //if (x < 2)
                            //    console.log(r,g,b);
                            
                            for (var cy = 0; cy < side; cy++) {
                                for (var cx = 0; cx < side; cx++) {
                                    var scy = y + cy - hside;
                                    var scx = x + cx - hside;
                                    
                                    if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                                        var pos = (scy * w + scx) * 4;
                                        var wt = a[cy * side + cx];
                                        
                                        r += d[pos + 0] * wt;
                                        g += d[pos + 1] * wt;
                                        b += d[pos + 2] * wt;
                                        l += d[pos + 3] * wt;
                                    }
                                }
                            }
                            out[dst + 0] = r;
                            out[dst + 1] = g;
                            out[dst + 2] = b;
                            out[dst + 3] = 255;
                        }
                    }
                    
                    return out;
                break;
                
                default:
                    console.log([n,a,d]);
            }
            return d;
        };
        
        // filter name, parameters array
        window.applyFilter = function(n,a) {
            //PXR.d.putImageData(new ImageData(PXR.h,PXR.e,PXR.f), 0, 0);
            p.o.putImageData(new ImageData(getFilterOutput(n, a, p.d), p.w, p.h), 0, 0);
            p.d = p.o.getImageData(0, 0, p.w, p.h).data;
        };
        
        var buttons = {
            'Invert': function() {
                applyFilter('invert');
            },
            'Grayscale': function() {
                applyFilter('grayscale');
            },
            'Brighten': function() {
                applyFilter('brighten', [ 32 ]);
            },
            'Threshold': function() {
                applyFilter('threshold', [ 127 ]);
            },
            'Sharpen': function() {
                applyFilter('convolute', [
                     0, -1,  0,
                    -1,  5, -1,
                     0, -1  ,0
                ]);
            },
            'Box Blur': function() {
                applyFilter('convolute', [
                    1/9, 1/9, 1/9,
                    1/9, 1/9, 1/9,
                    1/9, 1/9, 1/9
                ]);
            },
            'Gaussian Blur': function() {
                applyFilter('convolute', [
                    1/16, 1/8, 1/16,
                     1/8, 1/4,  1/8,
                    1/16, 1/8, 1/16
                ]);
            },
            'Sobel X': function() {
                applyFilter('convolute', [
                    -1, 0, 1,
                    -2, 0, 2,
                    -1, 0, 1
                ]);
            },
            'Sobel Y': function() {
                applyFilter('convolute', [
                    -1, -2, -1,
                     0,  0,  0,
                     1,  2,  1
                ]);
            },
            'SobelFeld X': function() {
                applyFilter('convolute', [
                     -3, 0,  3,
                    -10, 0, 10,
                     -3, 0,  3
                ]);
            },
            'SobelFeld Y': function() {
                applyFilter('convolute', [
                    -3, -10, -3,
                     0,   0,  0,
                     3,  10,  3
                ]);
            },
            'Laplace': function() {
                applyFilter('convolute', [
                    0,  1, 0,
                    1, -4, 1,
                    0,  1, 0
                ]);
            },
            'Sharpen 2': function() {
                applyFilter('convolute', [
                    -1, -1, -1,
                    -1,  9, -1,
                    -1, -1, -1
                ]);
            },
            'Exagerate Edges': function() {
                applyFilter('convolute', [
                    1,  1, 1,
                    1, -7, 1,
                    1,  1, 1
                ]);
            },
            'Emboss': function() {
                applyFilter('convolute', [
                    -1, -1, 0,
                    -1,  0, 1,
                     0,  1, 1 
                ]);
            },
            'Bumpmap': function() {
                buttons['Grayscale']();
                buttons['Emboss']();
            }
        };
        
        function addButton(n,f) {
            var but = document.createElement('button');
            but.setAttribute('type', 'button');
            but.setAttribute('class', 'btn btn-info');
            but.addEventListener('click', function(e) {
                f();
            });
            but.innerHTML = n;
            document.getElementById('buttons').appendChild(but);
        }
        
        window.bA = window.bA || false;
        
        if (!window.bA) {
            for (var k in buttons) {
                addButton(k, buttons[k]);
            }
            window.bA = true;
        }
        
        document.getElementById('buttons').style.display = "block";
    });
})();
