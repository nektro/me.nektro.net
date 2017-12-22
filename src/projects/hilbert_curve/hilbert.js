/*
 * @author Nektro (Sean Denny)
 * Copyright (c) 2017
 *
 * JS Implementation of different levels of Hilbert space-filling curves.
 * // NOTE: 1d curve is mapped as Π
 */
'use strict';
/**/
function hilbert(n) {
    switch (n) {
        case 1: return function(x) {
            const n = (x | 0) % 4;
            return [[0,0], [0,1], [1,1], [1,0]][n];
        }
        default: return function(x) {
            const i = x | 0;
            const j = Math.pow(2, 2 * n);
            const k = Math.pow(2, n);
            const m = i % j;
            const q = m / (j / 4) | 0;
            const a = hilbert(n - 1)(i);
            const o = Math.pow(2,n-1);
            switch (q) {
                case 0: return [ a[1], a[0] ];
                case 1: return [ a[0], a[1]+o ];
                case 2: return [ a[0]+o, a[1]+o ];
                case 3: return [ -a[1]+k-1, -a[0]+k-1-o ];
            }
        }
    }
}
