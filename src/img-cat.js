var getPixels = require('get-pixels');
var x256 = require('x256');

var Promise = require('es6-promise').Promise;

var pkg = require('../package.json');
var escaped = require('./escaped');
var bg_256 = require('./bg-256');
var BG = require('./bg');

var NL = '\n';
var PX = '  ';

function bg(r, g, b, a) {
    // Don't print anything to leave the background transparent.
    return a === 255 ? bg_256(r, g, b) : '';
}

function from_pixels(pixels) {
    // Grab the first frame of an animated GIF.
    if (pixels.shape.length === 4) {
        pixels = pixels.pick(0, null, null, null);
    }

    var w = pixels.shape[0];
    var h = pixels.shape[1];

    var s = NL;
    for (var j = 0; j < h; j++) {
        s += BG.CLEAR;
        s += PX;
        for (var i = 0; i < w; i++) {
            var r = pixels.get(i, j, 0);
            var g = pixels.get(i, j, 1);
            var b = pixels.get(i, j, 2);
            var a = pixels.get(i, j, 3);

            s += BG.CLEAR;
            s += bg(r, g, b, a);
            s += PX;
        }
        s += BG.CLEAR;
        s += NL;
    }

    return s;
}

function from_file(path) {
    return new Promise(function(resolve, reject) {
        getPixels(path, function(err, pixels) {
            if (err) {
                reject(new Error('could not read: ' + path));
            }
            try {
                resolve(from_pixels(pixels));
            } catch (e) {
                reject(e);
            }
        });
    });
}

module.exports = {
    fromPixels: from_pixels,
    fromFile: from_file
};
