const config = require('../lib/config');
const logger = config.getLogger();

const path = require('path');
const app_dir_path = path.join(__dirname, '..');
const server = require(app_dir_path + '/server');

server.get('/', function(req, res){
    res.sendFile(app_dir_path + '/www/index.html');
});

const readinglist = require('./readinglist');
server.route('/api/readinglist/read/:page?')
   .get(readinglist.read);
server.route('/api/readinglist/read/:id')
      .get(readinglist.readById);
server.route('/api/readinglist/edit/:id')
    .post(readinglist.edit);

server.route('/api/readinglist/delete/:id')
    .post(readinglist.remove);

server.get('*', function(req, res){
    res.status(404).sendFile(app_dir_path + '/www/404.html');
});
