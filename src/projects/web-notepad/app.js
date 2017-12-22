// // // // // // // // // //
// MS Windows Notepad      //
// for the Web             //
// by Sean Denny (Nektro)  //
// // // // // // // // // //
'use strict';

(function() {
    /* do utility non app things
    */
    HTMLCollection.prototype.indexOf = function(e) {
        for (var i = 0; i < this.length; i++)
        if (this[i] === e)
            return i;
        return -1;
    };
    NodeList.prototype.addEventListener = function(t,cb) {
        this.forEach(function(v,i) {
            v.addEventListener(t, cb);
        });
    };
    Array.prototype.random = function() {
        return this[Math.floor(Math.random() * this.length)];
    };

    /* construct app and initial all the things
    */
    var db = new Dexie("windows-notepad");
    db.version(1).stores({
        files: 'idn,name,data'
    });

    db.open().catch(function(err) {
        sweetAlert("IndexedDB Error", err, "error");
    });

    const file_idn  = 'file_' + (getQueryParameters().file || '0');
    let   file_name = '';
    function setFileName(n) {
        file_name = n;
        document.title = file_name + " - Notepad";
        document.getElementById('windows-head').setAttribute('file', file_name);
    }

    window.N = new Object();
    N.theme_colors = [
        'FFB900','FF8C00','F7630C','CA5010','DA3B01','EF6950','D13438','FF4343',
        'E74856','E81123','EA005E','C30052','E3008C','BF0077','C239B3','9A0089',
        '0078D7','0063B1','8E8CD8','6B69D6','8764B8','744DA9','B146C2','881798',
        '0099BC','2D7D9A','00B7C3','038387','00B294','018574','00CC6A','10893E',
        '7A7574','5D5A58','68768A','515C6B','567C73','486860','498205','107C10',
        '767676','4C4A48','69797E','4A5459','647C64','525E54','847545','7E735F'
    ];
    N.theme_fonts = [
        'Arial', 'Georgia', 'Palatino Linotype', 'Times New Roman',
        'Arial Black', 'Comic Sans MS', 'Impact', 'Lucidia Sans Unicode',
        'Tahoma', 'Trebuchet MS', 'Verdana', 'Courier New', 'Lucidia Console'
    ];
    N.menubar = [
        {
            name: 'File',
            sub: [
                {
                    name: 'New',
                    action: function() {
                        db.files.orderBy('idn').reverse().toArray().then(function(fo) {
							try {
								var nidn = parseInt(fo[0].idn.split('_')[1]) + 1;
								window.open(`./?file=${nidn}`);
							}
							catch (e) {
								sweetAlert("Cannot open new document.", "No documents are saved.", "error");
							}
                        });
                    }
                }, {
                    name: 'Open...',
                    action: function() {
                        sweetAlert("Open a file", "Coming soon");
                    }
                }, {
                    name: 'Save',
                    action: function() {
                        db.files.put({
                            idn: file_idn,
                            name: file_name,
                            data: document.getElementById('doc').value
                        });
                        sweetAlert("Saved!", "", "success");
                    }
                }, {
                    name: 'Save As...',
                    action: function() {
                        sweetAlert({
                            title: "Save As...",
                            type: "input",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            inputPlaceholder: "Title..."
                        },
                        function(iv) {
                            if (iv === false) return false;

                            if (iv === "") {
                                sweetAlert.showInputError("Title cannot be blank!");
                                return false;
                            }
                            setFileName(iv);
                            db.files.put({
                                idn: file_idn,
                                name: file_name,
                                data: document.getElementById('doc').value
                            });
                            sweetAlert("Saved", "", "success");
                        });
                    }
                }, {
                    name: 'Save to File...',
                    action: function() {
                        var blob = new Blob([document.getElementById('doc').value], {type: "text/plain;charset=utf-8"});
                        sweetAlert({
                            title: "Save As...",
                            type: "input",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            inputPlaceholder: "Title..."
                        },
                        function(iv) {
                            if (iv === false) return false;

                            if (iv === "") {
                                sweetAlert.showInputError("Title cannot be blank!");
                                return false;
                            }

                            saveAs(blob, iv.indexOf(".") > -1 ? iv : iv+".txt");
                            sweetAlert("Saved", "", "success");
                        });
                    }
                }, {
                    name: '',
                }, {
                    name: 'Print...',
                    action: function() {
                        window.print();
                    }
                }
            ]
        }, {
            name: 'Format',
            sub: [
                {
                    name: 'Word Wrap',
                    active: true
                }, {
                    name: 'Theme...',
                    action: function() {
                        W.header.randomizeTheme();
                    }
                }
            ]
        }, {
            name: 'Help',
            sub: [
                {
                    name: 'View Help',
                    action: function() {
                        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
                    }
                }, {
                    name: 'About Notepad',
                    action: function() {
                        sweetAlert("About Notepad", `Windows Notepad for the Web\nAdapted by Nektro\nv1.1\n\n${navigator.userAgent.split(')').join(")\n")}`);
                    }
                }, {
                    name: 'Back to nektro.net',
                    action: function() {
                        location.assign('../../');
                    }
                }
            ]
        }
    ];

    /* do angular things
    */
    angular.module('notepad', []).controller('appCtrl', function ($scope) {
        $scope.menubar = N.menubar;
        $scope.clickMenuItem = function(a,b) {
            if (N.menubar[a].sub[b].action) {
                N.menubar[a].sub[b].action();
                W.menubar.closeMenu();
            }
            else {
                console.log('No function is defined for menu item: [' + N.menubar[a].name + ' -> ' + N.menubar[a].sub[b].name + ']');
                sweetAlert(N.menubar[a].name + " → " + N.menubar[a].sub[b].name, "Oops... This button doesn't do anything yet.");
            }
        };
    });

    /* Windows looking stuff
    */
    window.W = {};
    try {
        var mb = document.getElementById('windows-menubar');
        if (mb === null)
        throw new Exception('no menubar.');
        W.header = {
            randomizeTheme: function() {
                document.getElementById('windows-head').setAttribute('color', '#'+N.theme_colors.random());
            }
        };
        W.menubar = {};
        W.menubar.ele = mb;
        W.menubar.selected = -1;
        W.menubar.openMenu = function(m) {
            if (W.menubar.selected > -1)
                W.menubar.closeMenu()
            W.menubar.selected = m;
            W.menubar.ele.children[0].children[W.menubar.selected].setAttribute('aria-expanded', true);
        };
        W.menubar.closeMenu = function() {
            W.menubar.ele.children[0].children[W.menubar.selected].setAttribute('aria-expanded', false);
            W.menubar.selected = -1;
        };
        document.getElementById('windows-menubar').addEventListener('click', function(e) {
            var ind = W.menubar.ele.children[0].children.indexOf(e.target);
            if (ind > -1) {
                W.menubar.openMenu(ind);
            }
        });
        document.body.addEventListener('click', function(e) {
            if (e.path.indexOf(W.menubar.ele) < 0) {
                if (W.menubar.selected > -1) {
                    W.menubar.closeMenu();
                }
            }
        });
    }
    catch (e) {}

    /* things that require window-load
    */
    window.addEventListener('load', function() {
        W.header.randomizeTheme();

        document.querySelectorAll("#windows-menubar > ul > li").addEventListener('mouseover', function(e) {
            if (W.menubar.selected > -1) {
                var mi = W.menubar.ele.children[0].children.indexOf(e.target);
                if (mi > -1) W.menubar.openMenu(mi);
            }
        });

        db.files.get(file_idn)
        .then(function(fo) {
            if (fo !== undefined) {
                setFileName(fo.name);
                document.getElementById('doc').value = fo.data;
            }
            else {
                setFileName('Untitled');
                document.getElementById('doc').value = '';
            }
        });
    });
})();
