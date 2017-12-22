(function() {
    window.addEventListener('load', function() {
        var qp = getQueryParameters();
        var then = Date.now();
        var namedates = {
            "trump_leaves_white_house": [ 1611248400000, "Trump leaves the White House", "He's gone" ]
        };
        var end_text = "Time's Up";

        if (qp.to !== undefined) {
            then = new Date(parseInt(qp.to));
            document.getElementById('date').innerHTML = then.toString().substring(0, 33);

        }
        if (qp.until !== undefined) {
            if (Object.keys(namedates).indexOf(qp.until) > -1) {
                var o = namedates[qp.until];
                then = new Date(o[0]);
                document.getElementById('date').innerHTML = o[1];
                document.title = "How long until " + o[1] + "? - " + document.title;
                end_text = o[2];
            }
        }

        // din at six 1504260000000
        var func = function() {
            var now = new Date().getTime();
            var dist = then - now;
            var days = Math.floor(dist / (1000 * 60 * 60 * 24));
            var hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((dist % (1000 * 60)) / 1000);
            document.getElementById("output").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

            if (dist < 0) {
                document.getElementById("output").innerHTML = end_text + "!";
                clearInterval(func);
            }
        };
        setInterval(func, 1000);
    });
})();
