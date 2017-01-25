var sqlite = require('sqlite3').verbose();
var path = require('path');

module.exports = function (config) {
    var dbPath;
    var dbFile;

    if (config.path) {
        dbPath = path.join(process.cwd(), config.path);
        if (config.db === ':memory:' || config.db === '') {
            dbFile = config.db;
        } else {
            dbFile = dbPath + config.db;
        }
    }

    var db = new sqlite.Database(dbFile);

    if (config.dbConfiguration) {
        var dbConfig = config.dbConfiguration;
        Object.keys(dbConfig).forEach(function (key) {
            db.configure(key, dbConfig[key]);
        });
    }

    return db;
}
