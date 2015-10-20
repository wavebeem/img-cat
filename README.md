img-cat
=======

Displays images in your terminal using 256-color mode. Can display PNG, GIF,
and JPEG images. Requires a 256-color terminal. GNU Screen does not support
256-color mode out of the box, so search for how to enable that if you're
having issues.

Installation
------------

    npm install -g img-cat

Usage
-----

    usage: img-cat [options] [--] [images]
      -h, --help, -?       display this help text
      -v, --version        display version string
      --copyright          display copyright information

Tips
----

You can store the output of `img-cat` to a file and then simply `cat` it later
to view it.

*Example:*

    img-cat cool.png > cool.ansi
    cat cool.ansi

And then you can add `cat cool.ansi` to your `~/.bashrc` or `~/.zshrc` to have
it print out when you open a terminal.

Library
-------

`img-cat` can also be used as a library.

*Example:*

```javascript
var imgcat = require("imgcat");
imgcat.fromFile("/path/to/my/file.png")
    .then(function(x) { console.log(x); });
```
