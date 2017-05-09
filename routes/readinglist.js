const config = require('../lib/config');
const logger = config.getLogger();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var readingListDB = mongoose.createConnection('mongodb://localhost/readingList');
var item = readingListDB.model(
    'item',
    new mongoose.Schema({
        url: String,
        title: String,
        webshot: String
    })
);

function read (req, res, next) {
    // add parameter to handle pagination
    res.setHeader('Content-Type', 'application/json');
    item.find({}).limit(12)
    .then(function(data){
        res.jsonp(data);
    })
    .catch(function(err) {
        logger.debug(err);
    });
}

function readById (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    item.findById(req.params.id)
    .then(function(data){
        res.jsonp(data);
    })
    .catch(function(err) {
        logger.debug(err);
    });
}

function getImage (req, res, next) {
    // button to get image from url and save with _id to image
    // if no image selected get screenshot
    // images res save must be 260x240
}

function edit (req, res, next) {
    var newTitle = req.body.title;
    res.setHeader('Content-Type', 'application/json');
    item.findByIdAndUpdate(req.params.id, {title: req.body.title})
    .then(function(){
        res.jsonp({message: "document updated"});
    })
    .catch(function(err) {
        logger.debug(err);
    });
}
function remove (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    item.findByIdAndRemove(req.params.id)
    .then(function(){
        res.jsonp({message: "document deleted"});
    })
    .catch(function(err) {
        logger.debug(err);
    });
}


exports.remove = remove;
exports.edit = edit;
exports.getImage = getImage;
exports.read = read;
exports.readById = readById;
