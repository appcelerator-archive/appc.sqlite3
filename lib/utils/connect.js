var sqlite3 = require('sqlite3').verbose();
var path = require('path');

module.exports = function (config) {
    var dbFile;
    var db;

    if (config.db === ':memory:' || config.db === '') {
        dbFile = config.db;
    } else {
        if (typeof config.path !== "undefined") {
            var dbPath = path.join(process.cwd(), config.path);
            dbFile = dbPath + config.db;
        }
    }

    try {
        db = new sqlite3.Database(dbFile);
    } catch (error) {
        throw new Error(error);
    }
    
    if (typeof config.dbConfiguration !== "undefined") {
        var dbConfig = config.dbConfiguration;
        Object.keys(dbConfig).forEach(function (key) {
            db.configure(key, dbConfig[key]);
        });
    }

    return db;
}
