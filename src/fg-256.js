var escaped = require('./escaped');
var x256 = require('x256');
module.exports = function fg_256(r, g, b) {
    return escaped(38, 5, x256(r, g, b));
};
