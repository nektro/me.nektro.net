(function() {
    window.addEventListener('load', function() {
        var data = [0,0,0,0,0,0,0,0,0,0];
        var elem = [0,1,2,3,4,5,6,7,8,9].map(function(x) {
            return document.getElementById('dc' + x);
        });
        var isGoing = true;
        var pause_buton = document.getElementById('pb');
        var out_pre = document.getElementById('out');
        var count = 0;
        var len = Math.pow(2, 16);
        var digits_gen = digit_of_pi(len);
        digits_gen.next(); // skip the first 0
        //
        //
        function addTC(d) {
            data[d] += 1;
            elem[d].innerHTML = data[d];
            out_pre.innerHTML = count;
        }
        window.pause = function() {
            isGoing = !isGoing;
            pause_buton.innerHTML = isGoing ? 'Pause' : 'Resume';
            if (isGoing) {
                setTimeout(func_1);
            }
            else {
                out_pre.innerHTML = count;
                console.log(count);
            }
        }
        function func_1() {
            var g = digits_gen.next();
            if (g.done === false) {
                addTC(g.value);
                count += 1;
                if (isGoing) {
                    setTimeout(func_1);
                }
            }
        }
        func_1();
    });
})();
