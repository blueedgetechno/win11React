document.write(
    '<scr' +
        'ipt async src="https://www.googletagmanager.com/gtag/js?id=G-QNW5K71MZ0"></scr' +
        'ipt>'
);
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());

gtag('config', 'G-QNW5K71MZ0');

pikachu();
mario();
ohhh();

// https://github.com/WeiChiaChang/easter-egg-collection/blob/master/index.js

function pikachu() {
    'use strict';

    // type 'pikachu' on your keyboard
    var key = [80, 73, 75, 65, 67, 72, 85];
    var ck = 0;
    var max = key.length;

    var pikachu = function () {
        var shock = document.createElement('div');
        var img = new Image();
        img.src = data;
        img.style.width = '250px';
        img.style.height = '149px';
        img.style.transition = '1s all';
        img.style.position = 'fixed';
        img.style.left = 'calc(50% - 125px)';
        img.style.bottom = '-149px';
        img.style.zIndex = 999999;

        document.body.appendChild(img);

        window.setTimeout(function () {
            img.style.bottom = '0px';
        }, 50);

        window.setTimeout(function () {
            shock.style.width = '100%';
            shock.style.height = '100%';
            shock.style.left = 0;
            shock.style.top = 0;
            shock.style.position = 'fixed';
            shock.style.zIndex = 9999999;
            shock.style.background = '#fffb95';
            shock.style.opacity = 0;

            document.body.appendChild(shock);

            for (var x = 0; x < 81; x++) {
                (function (x) {
                    window.setTimeout(function () {
                        if (x % 2 === 0) {
                            shock.style.opacity = 0;
                        } else {
                            shock.style.opacity = 0.3;
                        }
                    }, x * 25);
                })(x);
            }
        }, 2500);

        window.setTimeout(function () {
            img.style.bottom = '-149px';
        }, 4300);
        window.setTimeout(function () {
            img.parentNode.removeChild(img);
            shock.parentNode.removeChild(shock);
        }, 5400);
    };
}

function mario() {
    'use strict';

    // type 'mario' on your keyboard
    let key = [77, 65, 82, 73, 79];
    let ck = 0;
    let max = key.length;

    let mario = function () {
        var shock = document.createElement('div');
        var img = new Image();
        img.src = data;
        img.style.width = '350px';
        img.style.height = '300px';
        img.style.transition = '6s all linear';
        img.style.position = 'fixed';
        img.style.left = '-400px';
        img.style.bottom = 'calc(-50% + 330px)';
        img.style.zIndex = 999999;

        document.body.appendChild(img);

        // window.setTimeout(function(){
        //   img.style.left = 'calc(50% - 200px)'
        // },50)

        window.setTimeout(function () {
            img.style.left = 'calc(100% + 500px)';
        }, 50);

        window.setTimeout(function () {
            img.parentNode.removeChild(img);
        }, 6000);
    };

    let data = 'https://i.imgur.com/QbN03gd.gif';

    init(data);
}

function ohhh() {
    'use strict';

    // type 'ohhh' on your keyboard
    var key = [79, 72, 72, 72];
    var ck = 0;
    var max = key.length;

    var ohhh = function () {
        var shock = document.createElement('div');
        var img = new Image();
        img.src = data;
        img.style.width = '400px';
        img.style.height = '300px';
        img.style.transition = '1s all';
        img.style.position = 'fixed';
        img.style.left = 'calc(50% - 200px)';
        img.style.bottom = '-300px';
        img.style.zIndex = 999999;

        document.body.appendChild(img);

        window.setTimeout(function () {
            img.style.bottom = '0px';
        }, 0);

        window.setTimeout(function () {
            img.style.bottom = '-300px';
        }, 4300);
        window.setTimeout(function () {
            img.parentNode.removeChild(img);
            shock.parentNode.removeChild(shock);
        }, 5400);
    };



    var data = 'https://i.imgur.com/GWAyANH.png';
    init(data);
}
