
module.exports = {
    getPKColumnName: getPKColumnName
}

/**
 * Gets the name of the primary key column of the table.
 * @param {Object} db The database.
 * @param {String} id ID of the model to find.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the found primary key column name found.
 */
function getPKColumnName(db, tableName, callback) {
    var sqlQuery = `PRAGMA table_info(${tableName})`;
    var resultPkName;

    db.all(sqlQuery, function (err, rows) {
        if (err) {
            return callback(err);
        }

        if (rows.length > 0) {
            setPkColName(rows);
        } else {
            return callback(new Error(`Table ${tableName} does not exist.`));
        }
    })

    function setPkColName(rows) {
        rows.forEach(function (table) {
            if (table.pk === 1) {
                resultPkName = table.name;
            }
        })

        callback(null, resultPkName);
    }
}