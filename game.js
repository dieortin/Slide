/*jslint browser: true, devel:true, plusplus: true*/
//GLOBAL VARIABLES, CANVAS
var FPS = 25;
var d = new Date();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
//ADJUST CANVAS SIZE
var viewportWidth = document.documentElement.clientWidth;
var viewportHeight = document.documentElement.clientHeight;
if (viewportWidth <= 500) {
    canvas.width = viewportWidth;
    canvas.height = viewportHeight;
} else if (viewportWidth > 500 && viewportWidth <= 750) {
    canvas.width = viewportWidth * 0.75;
    canvas.height = viewportHeight;
} else if (viewportWidth > 750) {
    canvas.width = 500;
    canvas.height = canvas.width * 4 / 3;
}
//IMAGES FOR LOADING
var imageURLs = ['./frog.png', './jumpfrog.png'];
var imagesOK = 0;
var imgs = [];

//CHARACTER CHARACTERISTICS
var character = {
    xpos: 0,
    ypos: canvas.height / 2 - 30, //TODO: replace 30, as it's an unadjustable value
    stopped: {
        width: 50,
        height: 60
    },
    flying: {
        width: 100,
        height: 50
    },
    speed: 300, //in miliseconds per bounce
    inBorder: [true, 'left']
};

//USER INPUT HANDLING
var numFrames = 0;
var frameSize = 0;
var movDir = true; //TRUE = RIGHT, FALSE = LEFT
var setMov = function () {
    'use strict';
    numFrames = character.speed / (1000 / FPS);
    frameSize = (canvas.width - character.stopped.width) / numFrames;
};
var keyDown = function () {
    'use strict';
    if (character.inBorder[0]) {
        setMov();
        character.inBorder = [false, false];
        movDir = !movDir;
    }
};
loadAllImages(start);

function loadAllImages(callback) {
    for (var i = 0; i < imageURLs.length; i++) {
        var img = new Image();
        imgs.push(img);
        img.onload = function () {
            imagesOK++;
            if (imagesOK >= imageURLs.length) {
                callback();
            }
        };
        img.onerror = function () {
            alert("image load failed");
        }
        img.crossOrigin = "anonymous";
        img.src = imageURLs[i];
    }
}

//SECONDARY CANVAS FOR FLIPPING IMAGE
var flip = function (image) {
    'use strict';
    var offscreenCanvas = document.createElement('canvas'),
        offscreenCtx = offscreenCanvas.getContext('2d');
    var img = image;
    offscreenCanvas.width = img.width;
    offscreenCanvas.height = img.height;

    offscreenCtx.translate(img.width, 0);
    offscreenCtx.scale(-1, 1);
    offscreenCtx.drawImage(img, 0, 0);
    return offscreenCanvas;
};

addEventListener("keydown", function () {
    'use strict';
    keyDown();
}, false);
// after all images are loaded, start using the images here

function start() {
    var charImg = imgs[0],
        charImg2 = imgs[1];

    //CACHE FOR FLIPPED IMAGES
    var flippedCharImg = flip(charImg);
    var flippedCharImg2 = flip(charImg2);




    //UPDATE THE OBJECT'S POSITION
    var update = function () {
        'use strict';
        if (numFrames) {
            if (movDir) {
                character.xpos += frameSize;
                numFrames--;
            } else if (!movDir) {
                numFrames--;
                character.xpos -= frameSize;
            }
        }

        //CHECK IF CHARACTER SURPASSED BORDER
        /*if (character.inBorder[0] === false) {*/
        if (character.xpos >= canvas.width - character.stopped.width) { //If surpassed RIGHT border
            character.xpos = canvas.width - character.stopped.width;
            character.inBorder = [1, 'right'];
        } else if (character.xpos <= 0) { //If surpassed LEFT border
            character.xpos = 0;
            character.inBorder = [1, 'left'];
        }
        /*}*/
    };
    var draw = function () {
        'use strict';
        canvas.width = canvas.width; //CLEAR
        if (character.inBorder[0]) {
            if (character.inBorder[1] === 'right') {
                ctx.drawImage(charImg, character.xpos, character.ypos, character.stopped.width, character.stopped.height);
            } else if (character.inBorder[1] === 'left') {
                ctx.drawImage(flippedCharImg, character.xpos, character.ypos, character.stopped.width, character.stopped.height);
            }

        } else {
            if (movDir) {
                ctx.drawImage(charImg2, character.xpos, character.ypos, character.flying.width, character.flying.height);
            } else if (!movDir) {
                ctx.drawImage(flippedCharImg2, character.xpos, character.ypos, character.flying.width, character.flying.height);
            }
        }
    };
    var main = function () {
        'use strict';
        update();
        draw();
    };
    setInterval(main, 1000 / FPS);
}
