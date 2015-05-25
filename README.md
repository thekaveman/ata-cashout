# ata-cashout

AngularJS leave time cash out calculator for ATA.

## Setup

Make sure you have `npm` installed (it comes with [`nodejs`](https://nodejs.org/download/))

Then get `bower` if you don't already have it installed:

    $ npm install -g bower

And finally setup the dev and runtime dependencies:

    $ npm install && bower install && grunt dev

Tests can be run using:

    $ karma start karma.config.js

Prepare for deployment (package created in `dist/`) with:

    $ grunt dist

Deploy to GitHub using the `grunt-gh-pages` grunt task:

    $ grunt deploy