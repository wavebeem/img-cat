var getPixels = require('get-pixels');
var x256 = require('x256');

var ALPHA_TRESHHOLD = 255;
var PIXEL_CHAR = '  ';
var BG_CLEAR = '\033[0m';

var out = process.stdout;
var COLS = out.columns;
var ROWS = out.rows;

var should_pad = true;

var image = process.argv[2];

function bg_256(r, g, b) {
    return '\033[48;5;' + x256(r, g, b) + 'm'
}

getPixels(image, function(err, pixels) {
    if (err) {
        // TODO
        console.error('Error reading ' + image);
        return;
    }

    var w = pixels.shape[0];
    var h = pixels.shape[1];

    if (should_pad) {
        out.write('\n');
    }

    for (var j = 0; j < h; j++) {
        if (should_pad) {
            out.write(BG_CLEAR);
            out.write('  ');
        }

        for (var i = 0; i < w; i++) {
            var r = pixels.get(i, j, 0);
            var g = pixels.get(i, j, 1);
            var b = pixels.get(i, j, 2);
            var a = pixels.get(i, j, 3);

            out.write(BG_CLEAR);

            if (a >= ALPHA_TRESHHOLD) {
                out.write(bg_256(r, g, b));
            }

            out.write(PIXEL_CHAR);
        }

        out.write('\n');
    }

    if (should_pad) {
        out.write('\n');
    }
});
