const config = require('../lib/config');
const logger = config.getLogger();

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = global.Promise;

var readingListDB = mongoose.createConnection('mongodb://localhost/readingList');

var schema = new mongoose.Schema({
    url: String,
    title: String,
    webshot: String
});
schema.plugin(mongoosePaginate);
var item = readingListDB.model('item',  schema);

function read (req, res, next) {
    var options = {
        page: parseInt(req.params.page, 10) || 1
    };
    res.setHeader('Content-Type', 'application/json');
    item.paginate({}, options)
    .then(function(result){
        logger.info("total:", result.total);
        logger.info("limit:", result.limit);
        logger.info("page:", result.page, "/", result.pages);
        result.next_page_url = null;
        result.prev_page_url = null;
        if(result.page === 1 && result.page < result.pages) {
            result.next_page_url = "/api/readinglist/read/" + (result.page + 1).toString();
            result.prev_page_url = null;
        } else if (result.page > 1 && result.page === result.pages) {
            result.prev_page_url = "/api/readinglist/read/" + (result.page - 1).toString();
            result.next_page_url = null;
        } else {
            result.next_page_url = "/api/readinglist/read/" + (result.page + 1).toString();
            result.prev_page_url = "/api/readinglist/read/" + (result.page - 1).toString();
        }
        res.jsonp(result);
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
