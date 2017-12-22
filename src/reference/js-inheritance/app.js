function convertYMLtoTreeView(obj) {
    return obj.map(function(x) {
        switch (typeof x) {
            case 'object': {
                let n = Object.keys(x)[0];
                return {
                    name: n,
                    children: convertYMLtoTreeView(x[n])
                };
            }
            case 'string': {
                return {
                    name: x
                }
            }
        }
    });
}
//
fetch('sortedall.yml')
.then((r) => { return r.text(); })
.then((r) => {
    const doc = jsyaml.load(r);
    const tvp = convertYMLtoTreeView(doc);
    //
    Vue.component('tv-item', {
        template: '#item-template',
        props: { model: Object },
        data: function () { return { open: true }; },
        computed: { isFolder: function () { return this.model.children && this.model.children.length; } },
        methods: { toggle: function () { if (this.isFolder) { this.open = !this.open; } } }
    });
    //
    var app = new Vue({
        el: '#app',
        data: {
            treeData: tvp[0]
        }
    });
});
