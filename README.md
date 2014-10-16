img-cat
=======

Displays images in your terminal using 256-color mode. Can display PNG, GIF,
and JPEG images. Requires a 256-color terminal. GNU Screen does not support
256-color mode out of the box, so search for how to enable that if you're
having issues.

Installation
------------

`npm install -g img-cat`

Usage
-----

`img-cat IMAGE_FILE`

Tips
----

You can store the output of `img-cat` to a file and then simply `cat` it later
to view it.

*Example:*

    img-cat cool.png > cool.ansi
    cat cool.ansi

And then you can add `cat cool.ansi` to your `~/.bashrc` or `~/.zshrc` to have
it print out when you open a terminal.

Notes
-----

img-cat is still under active development. Planned options include the option
to remove padding around the image, grayscale output, and possibly 16-color
mode (using the terminal-defined palette).
