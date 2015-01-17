module.exports = function escaped(s) {
    var s = [].join.call(arguments, ';');
    return '\033[' + s + 'm';
};
