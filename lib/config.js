
const path = require('path');
const fs = require('fs');
const tracer = require('tracer');
const commander = require('commander');
const convict = require('convict');

const DEFAULT_FILE_NAME = 'config.json';
const SCHEMA_NAME = 'config-schema.json';

const app_dir_path = path.join(__dirname, '..');
const logger = tracer.colorConsole({level: 'trace'});

var pkg;
var conf_file_path;
var conf;

function init() {
    pkg = require(path.join(app_dir_path, 'package.json'));

    commander
        .version(pkg.version)
        .option('--conf <file>', "Load a configuration file")
        .parse(process.argv);

    conf_file_path = commander.conf;
    if (!conf_file_path) {
        conf_file_path = path.join(app_dir_path, DEFAULT_FILE_NAME);
    }

    var conf_schema_path = path.join(app_dir_path, SCHEMA_NAME);
    conf = convict(conf_schema_path);

    // Loading a config file if present, otherwise default values will be used
    if (fs.existsSync(conf_file_path)) {
        logger.debug("Loading config file", path.resolve(conf_file_path));
        conf.loadFile(conf_file_path);
    }

    try {
        conf.validate({allowed: 'strict'});
    } catch (err) {
        logger.error(err);
        process.exit(3);
    }
    updateLogLevel();
}

function get(prop_name) {
    return conf.get(prop_name);
}

function getLogger() {
    return logger;
}

function updateLogLevel() {
    tracer.setLevel(conf.get('log_level'));
}

init();

exports.getLogger = getLogger;
exports.get = get;
