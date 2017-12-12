var sqlite3 = require('sqlite3').verbose();
var path = require('path');

module.exports = {
  setDatabase: setDatabase,
  closeDb: closeDb
};

function setDatabase(config) {
  var dbFile;
  var db;

  if (config.db !== ':memory:' || config.db !== '') {
    if (config.path) {
      var dbPath = path.join(process.cwd(), config.path);
      dbFile = dbPath + config.db;
    } else {
      throw new Error('The path to the database folder must be specified.');
    }
  } else {
    dbFile = config.db;
  }

  try {
    db = new sqlite3.Database(dbFile);
  } catch (error) {
    throw new Error(error);
  }

  if (config.dbConfiguration) {
    var dbConfig = config.dbConfiguration;
    Object.keys(dbConfig).forEach(function (key) {
      db.configure(key, dbConfig[key]);
    });
  }

  return db;
}

// Will wait until all pending queries are completed before closing the database.
function closeDb(database) {
  database.close();
}