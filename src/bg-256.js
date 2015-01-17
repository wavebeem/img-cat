var escaped = require('./escaped');
var x256 = require('x256');
module.exports = function bg_256(r, g, b) {
    return escaped(48, 5, x256(r, g, b));
};
