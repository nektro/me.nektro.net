(function() {
    window.addEventListener('load', async function() {
        document.querySelectorAll('ul.emj').forEach(function(v,i) {
            twemoji.parse(v, function(icon) {
                const icon4 = icon.split('-').map(x => x.padStart(4,'0')).join('-');
                switch (location.search) {
                    case '?twitter':   return `https://twemoji.maxcdn.com/2/svg/${icon}.svg`;
                    case '?emojione1': return `https://cdnjs.cloudflare.com/ajax/libs/emojione/1.5.2/assets/svg/${icon.toUpperCase()}.svg`;
                    case '?emojione2': return `https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/${icon4}.svg`;
                    case '?noto':      return `https://noto-website.storage.googleapis.com/emoji/emoji_u${icon4.replaceAll('-','_')}.png`;
                    case '?emojione3': return `https://api.emojione.com/emoji/${icon4}/download/64`;
                    //case '?gmail': /* same as noto but worse */ return `https://mail.google.com/mail/e/${icon4}`;
                }
            });
        });
    });
})();
