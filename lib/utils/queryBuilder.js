module.exports = function (tableName, params, queryObject) {
    var selectQuery = '';
    var whereQuery = '';
    var orderQuery = '';
    var limitQuery = '';
    var skipQuery = '';

    if (queryObject.sel && Object.keys(queryObject.sel).length > 0) {
        selectQuery += buildSelectQuery(queryObject, tableName);
    } else {
        selectQuery += `SELECT * FROM ${tableName}`;
    }

    if (queryObject.where && Object.keys(queryObject.where).length > 0) {
        whereQuery += buildWhereQuery(queryObject.where, params);
    } else if (!queryObject.distinct) {
        throw new Error("Missing required WHERE parameter.");
    }

    if (queryObject.order && Object.keys(queryObject.order).length > 0) {
        orderQuery += buildOrderByQuery(queryObject.order, params);
    }

    limitQuery += ' LIMIT ?';
    params.push(queryObject.limit || 10);

    if (queryObject.skip) {
        skipQuery += ' OFFSET ?';
        params.push(queryObject.skip);
    }

    return selectQuery + whereQuery + orderQuery + limitQuery + skipQuery;
};

function buildSelectQuery(queryObject, tableName) {
    var result = queryObject.distinct ? 'SELECT DISTINCT' : 'SELECT';
    Object.keys(queryObject.sel).forEach(function (key) {
        if (queryObject.sel[key]) {
            result += ` ${key},`;
        }
    });
    result = result.slice(0, -1);
    result += ` FROM ${tableName}`;

    return result;
}

function buildWhereQuery(where, params) {
    var result = '';

    Object.keys(where).forEach(function (key) {

        result += result === '' ? ' WHERE' : ' AND';
        switch (key) {
            case '$eq':
                result = processCommand(result, params, where.$eq, '=');
                break;
            case '$lt':
                result = processCommand(result, params, where.$lt, '<');
                break;
            case '$lte':
                result = processCommand(result, params, where.$lte, '<=');
                break;
            case '$gt':
                result = processCommand(result, params, where.$gt, '>');
                break;
            case '$gte':
                result = processCommand(result, params, where.$gte, '>=');
                break;
            case '$ne':
                result = processCommand(result, params, where.$ne, '!=');
                break;
            default:
                result += ` ${key} = ?`;
                params.push(where[key]);
                break;
        }
    });

    return result;
}

function processCommand(result, params, command, operator) {
    Object.keys(command).forEach(function (param) {
        result += ` ${param} ${operator} ?`;
        var value = command[param];
        params.push(value);
    });

    return result;
}

function buildOrderByQuery(order) {
    var result = ' ORDER BY';

    if (typeof order === 'string') {
        order = order
            .split(',')
            .reduce(function (res, prop) {
                res[prop] = 'ASC';
                return res;
            }, {});
    }

    Object.keys(order).forEach(function (key) {
        result += ` ${key} `;
        var orderKey = order[key];
        if (orderKey.toLowerCase() === 'asc') {
            result += 'ASC,';
        } else {
            result += 'DESC,';
        }
    });

    result = result.slice(0, -1);
    return result;
}