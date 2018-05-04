//
(function () {
    window.addEventListener('load', function () {
        //
        let prev = 0;
        const pusher = new Pusher('3e1959352a588fd552e8', {
            cluster: 'us2',
            encrypted: true
        });
        const channel = pusher.subscribe('my-channel');
        channel.bind('score', function(data) {
            document.getElementById('button').firstElementChild.textContent = data.value;
            prev = parseInt(data.by);
            document.getElementById('button').style.backgroundColor = (prev === pusher.sessionID ? 'darkred' : 'darkcyan');
        });
        //
        fetch(`https://oneapi.nektro.net/button/ping.php`)
        .then(x => x.json())
        .then(x => {
            document.getElementById('button').firstElementChild.textContent = x.score;
        });
        //
        document.getElementById('button').addEventListener('click', function () {
            if (!(prev === pusher.sessionID)) {
                fetch(`https://oneapi.nektro.net/button/push.php?key=${pusher.sessionID}`)
                .then(x => x.json())
                .then(x => {
                    document.getElementById('button').firstElementChild.textContent = x.score;
                    if (x.win) { swal('Congratulations!', 'You won!', 'success'); }
                });
            }
        });
        //
        document.getElementById('info').addEventListener('click', function () {
            swal(
                'About This Game',
                'This is an entry to the DEV.to Pusher Contest. Pusher allows developers to build realtime apps '
                + 'with less code.<br><br>The object of this game is to be the 100th person to click the button. '
                + 'Using Pusher\'s APIs, everyone playing the game experiences the same counter<br>and are competing '
                + 'to be the 100th clicker. As an added catch, you are not allowed to click the button twice in a '
                + 'row.<br><br>Good luck!',
                'question'
            );
        });
    });
})();
