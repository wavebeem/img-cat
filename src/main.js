#!/usr/bin/env node
var minimist = require('minimist');

var imgcat = require('./img-cat');
var escaped = require('./escaped');
var bg_256 = require('./bg-256');
var fg_256 = require('./fg-256');
var BG = require('./bg');

var args = process.argv.slice(2);
var argv = minimist(args);

var colors = {
    fg: {
        white: fg_256(0xff, 0xff, 0xff)
    },
    bg: {
        green_1: bg_256(0x00, 0x88, 0x00),
        green_2: bg_256(0x00, 0x66, 0x00),

        red_1: bg_256(0x88, 0x00, 0x00),
        red_2: bg_256(0xaa, 0x00, 0x00),
        red_3: bg_256(0xcc, 0x00, 0x00),
    }
};

function box(title, body) {
    function wrap(a, b, xs) {
        return a + xs.join(b + '\n' + a) + b;
    }

    var pre = BG.BOLD + colors.fg.white;
    var tbg = pre + colors.bg.green_2;
    var bbg = pre + colors.bg.green_1;

    console.log(wrap(tbg, BG.CLEAR, title));
    console.log(wrap(bbg, BG.CLEAR, body));
}

function usage() {
    box([
        ' usage: img-cat [options] [--] [images]               ',
    ], [
        '   -h, --help, -?       display this help text        ',
        '   -v, --version        display version string        ',
        '   --copyright          display copyright information ',
    ]);
    process.exit();
}

function version() {
    console.log(pkg.version);
    process.exit();
}

function copyright() {
    box([
        ' Copyright (c) 2014 Brian Mock                         ',
    ], [
        ' MIT license <http://opensource.org/licenses/MIT>      ',
        ' There is NO WARRANTY, to the extent permitted by law. ',
    ]);
    process.exit();
}

function die(s) {
    // Red gradient along the error message.
    console.error(''
        + BG.BOLD
        + colors.fg.white
        + colors.bg.red_1 + ' img-cat: '
        + colors.bg.red_2 + ' error: '
        + colors.bg.red_3 + ' ' + s + ' '
        + BG.CLEAR
    );
    process.exit(1);
}

function main() {
    // Grab all possible files.
    var paths = (argv._ || []).concat(argv['--'] || []);

    if (argv.v || argv.version) { version(); }
    if (argv.copyright) { copyright(); }

    // Show usage if they ask for help or do not supply any arguments.
    if (argv.h || argv.help || argv['?'] || paths.length === 0) {
        usage();
    }

    // Fun time!
    paths.forEach(function(p) {
        imgcat
            .fromFile(p)
            .then(function(s) { console.log(s); })
            .catch(function(e) { die(e.message); });
    });
}

main();
