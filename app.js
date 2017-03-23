'use strict';

const config = {
    input: process.argv[2],
    db: "readingList",
    path: "img/",
    size: "768x1024"
};

const logger = require('loglevel');
logger.setLevel("TRACE");
const scrape = require('html-metadata');
const fs = require('fs');
const screenshot = require('screenshot-stream');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var urls_to_read = require(config.input);

var readingListDB = mongoose.createConnection('mongodb://localhost/' + config.db);
var item = readingListDB.model(
    'item',
    new mongoose.Schema({
        url: String,
        title: String,
        path: String
    })
);

urls_to_read.forEach(function(url) {
    scrape(url)
    .then(function(metadata){
        let link = new item({
            url: url.uri,
            title:metadata.general.title,
            path: null
        });

        link.save()
        .then(function(doc) {
            return {canonical: doc.url, id: doc.id};
        }).then(function(data) {
            logger.info(data);
            let stream = screenshot(data.canonical, config.size, {crop: true});
            stream.pipe(fs.createWriteStream(config.path + data.id +'.png'));
            item.update(
                {"_id": data.id},
                {$set: {path: config.path + data.id +'.png'}},
                function(res) {
                    logger.info('record ' + data.id + ' updated');
                }
            );
        });
    }).catch(function(err) {
        fs.createWriteStream('data/node.error.log', {flags: 'a'});
        logger.error("Error:", err.status);
    });
});
