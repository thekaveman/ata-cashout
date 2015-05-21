# ata-cashout

AngularJS leave time cash out calculator for ATA.

## Setup

Make sure you have `npm` installed (it comes with [`nodejs`](https://nodejs.org/download/))

Then get `bower` if you don't already have it installed:

    $ npm install -g bower

And finally setup the dev and runtime dependencies:

    $ npm install && bower install && grunt dev

Tests can be run using:

    $ karma run karma.config.js

Prepare for deployment with:

    $ grunt dist