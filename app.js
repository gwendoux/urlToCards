'use strict';

const config = {
    input: process.argv[2],
    db: "readingList"
};

/*const options = {
    screenSize: {
        width: 320
        , height: 480
    }
    , shotSize: {
        width: 320
        , height: 'all'
    }
    , userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
    + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
};*/

const logger = require('loglevel');
logger.setLevel("TRACE");
const scrape = require('html-metadata');
// const fs = require('fs');
// const webshot = require('webshot');
// const sharp = require('sharp');
// const PngCrush = require('pngcrush');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var urls_to_read = require(config.input);

/*const transformer = sharp()
.resize(300)
.png();
*/
// const crusher = new PngCrush(['-brute', '-rem', 'alla']);

var readingListDB = mongoose.createConnection('mongodb://localhost/' + config.db);
readingListDB.setMaxListeners(0);
var item = readingListDB.model(
    'item',
    new mongoose.Schema({
        url: String,
        title: String,
        webshot: String
    })
);

urls_to_read.forEach(function(url) {
    scrape(url)
    .then(function(metadata){
        // let renderStream = webshot(url.uri, options);

        /*let img = 'data:image/png;base64';
        renderStream.on('readable',function(buffer){
            var part = renderStream.toString('base64');
            img += part;
        });*/

        let link = new item({
            url: url.uri,
            title:metadata.general.title,
            webshot: null
        });

        link.save();
    }).catch(function(err) {
        logger.info("Error:", url.uri);
        logger.error("Error:", err.msg);
    });
});
