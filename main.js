#!/usr/bin/env node

var getPixels = require('get-pixels');
var x256 = require('x256');
var minimist = require('minimist');

var pkg = require('./package.json');

var BG_CLEAR = '\033[0m';
var BG_BOLD = '\033[1m';
var NL = '\n';
var PX = '  ';

var args = process.argv.slice(2);
var argv = minimist(args);
var COLS = ~~process.stdout.columns;

function usage() {
    console.log([
        'usage: img-cat [options] [--] [images]',
        '  -h, --help, -?       display this help text',
        '  -v, --version        display version string',
        '  --copyright          display copyright information',
    ].join('\n'));
    process.exit();
}

function version() {
    console.log(pkg.version);
    process.exit();
}

function copyright() {
    console.log([
        'Copyright (c) 2014 Brian Mock',
        'MIT license <http://opensource.org/licenses/MIT>',
        'There is NO WARRANTY, to the extent permitted by law.'
    ].join('\n'));
    process.exit();
}

function die(s) {
    // Red gradient along the error message.
    console.error(''
        + BG_BOLD
        + fg_256(0xff, 0xff, 0xff)
        + bg_256(0x88, 0x00, 0x00)
        + ' img-cat: '
        + bg_256(0xaa, 0x00, 0x00)
        + ' error: '
        + bg_256(0xcc, 0x00, 0x00)
        + ' ' + s + ' '
        + BG_CLEAR
    );
    process.exit(1);
}

function assert_size(w, h) {
    if (COLS <= 0) return;
    var max = ~~(COLS / 2) - 4;
    // Show an error if the image would line wrap since it's really jarring.
    if (w > max) {
        die(
            'image is too large ' +
            '(' + w + 'x' + h + '); ' +
            'must be ' + max + ' or fewer pixels wide'
        );
    }
}

function bg(r, g, b, a) {
    // Don't print anything to leave the background transparent.
    return a === 255 ? bg_256(r, g, b) : '';
}

function bg_256(r, g, b) { return '\033[48;5;' + x256(r, g, b) + 'm' }
function fg_256(r, g, b) { return '\033[38;5;' + x256(r, g, b) + 'm' }

function process_pixels(pixels) {
    // Animated GIFs are 4D ([frames, w, h, color]),
    // instead of 3D ([w, h, color]).
    if (pixels.shape.length === 4) {
        pixels = pixels.pick(0, null, null, null);
    }

    var w = pixels.shape[0];
    var h = pixels.shape[1];

    assert_size(w, h);

    var s = NL;
    for (var j = 0; j < h; j++) {
        s += BG_CLEAR;
        s += PX;
        for (var i = 0; i < w; i++) {
            var r = pixels.get(i, j, 0);
            var g = pixels.get(i, j, 1);
            var b = pixels.get(i, j, 2);
            var a = pixels.get(i, j, 3);

            s += BG_CLEAR;
            s += bg(r, g, b, a);
            s += PX;
        }
        s += NL;
    }
    console.log(s);
}

function show_image(path) {
    getPixels(path, function(err, pixels) {
        if (err) die('could not read file: ' + path);
        process_pixels(pixels);
    });
}

function main() {
    if (argv.v || argv.version) { version(); }
    if (argv.copyright) { copyright(); }

    // Show usage if they ask for help or do not supply any arguments.
    if (argv.h || argv.help || argv['?'] || args.length === 0) {
        usage();
    }

    // Grab all possible files.
    var paths = (argv._ || []).concat(argv['--'] || []);

    // Fun time!
    paths.forEach(show_image);
}

main();
