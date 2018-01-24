if (!('forEach' in NodeList.prototype)) {
    NodeList.prototype.forEach = function(cb) {
        for (var i = 0; i < this.length; i++) {
            cb(this[i], i);
        }
    };
}
if (!('padStart' in String.prototype)) {
    // polyfill via https://github.com/KhaledElAnsari/String.prototype.padStart/blob/c2e4020/index.js
    String.prototype.padStart = function(targetLength, padString) {
        targetLength = Math.floor(targetLength) || 0;
        if(targetLength < this.length) return String(this);
        padString = padString ? String(padString) : " ";
        var pad = "";
        var len = targetLength - this.length;
        var i = 0;
        while(pad.length < len) {
            if(!padString[i]) {
                i = 0;
            }
            pad += padString[i];
            i++;
        }
        return pad + String(this).slice(0);
    }
}
(function() {
    window.addEventListener('load', function() {
        document.querySelectorAll('ul.emj').forEach(function(v,i) {
            twemoji.parse(v, function(icon) {
                var icon4 = icon.split('-').map(function(x) { return x.padStart(4,'0'); }).join('-');
                switch (location.search) {
                    case '?twitter':   return 'https://twemoji.maxcdn.com/2/svg/'+icon+'.svg';
                    case '?emojione1': return 'https://cdnjs.cloudflare.com/ajax/libs/emojione/1.5.2/assets/svg/'+icon.toUpperCase()+'.svg';
                    case '?emojione2': return 'https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/'+icon4+'.svg';
                    case '?noto':      return 'https://noto-website.storage.googleapis.com/emoji/emoji_u'+icon4.replaceAll('-','_')+'.png';
                    case '?emojione3': return 'https://api.emojione.com/emoji/'+icon4+'/download/64';
                    //case '?gmail': /* same as noto but worse */ return 'https://mail.google.com/mail/e/${icon4}';
                }
            });
        });
    });
})();
