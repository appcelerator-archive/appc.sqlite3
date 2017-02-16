# appc.sqlite3
An SQLite3 connector for Arrow

## 1. Installation
Just enter the following command in your arrow project root to install the SQLite3 connector. 
```sh 
appc install connector/appc.sqlite3
```
The command downloads and installs the connector to the node_modules/connector folder, updates the appc.json file, and generates a connector configuration file in the project's conf directory.

## 2. Configuration

Set the configuration object in your ``conf/default.js`` file:

```javascript
connectors: {
    'appc.sqlite3': {
	    db: '<database filename>',
	    path: '/path to the db file/',
        dbConfiguration: {
            ...
        },
	    modelAutogen: true,
	    generateModelsFromSchema: true
    }
}
```

* **filename** (required): Valid values are filenames, ":memory:" for an anonymous in-memory database and an empty string for an anonymous disk-based database. Anonymous databases are not persisted and when closing the database handle, their contents are lost.
* **dbConfiguration** (optional): You can set a db configuration object. Valid options are:
    * **trace**: provide a function callback as a value. Invoked when an database query executes with a rendering of the statement text.
    * **profile**: provide a function callback. Invoked every time a database query executes.
    * **busyTimeout**: provide an integer as a value.

This will automatically generate models based on your database schema. To create a new model, you will have to insert a table for it in the database and it will be generated for you.

## 3. Usage
Take a look at all available options and query parameters in the API documentation section of your arrow administration.
Options are available under the group **appc.sqlite3**.

### Example Model Usage
For example, to extend the user model, set it such as:

```javascript
var User = Arrow.Model.extend('user', {
    fields: {
        name: { type: String },
        email: { type: String },
        role: { type: String },
        username: { type: String }
    },
    connector: 'appc.sqlite3'
});
```

#### NOTE: To ensure the correct functianality of the connector, make sure each table in the database has a primary Key field `id` or `ID` which is AUTOINCREMENT-ed!

### Query operators currently supported:
#### Syntax: {"$lt": {"field": value} }
Example:   {"$eq":{"username":"John"},{"age":20}}

* $eq - matches entries with value of a field equal to the specified value
* $lt - matches entries with value of the field less than (i.e. <) the specified value
* $lte - matches entries with value of the field less than or equal to (i.e. <=) the specified value
* $gt - matches entries with value of the field greater than (i.e. >) the specified value
* $gte - matches entries with value of the field greater than or equal to (i.e. >=) the specified value
* $ne - matches entries with value of the field not equal (i.e. !=) to the specified value 

**Note** that the Model.Count method requires a WHERE parameter. If you want to get the count of all entries in a table, use the FindAll method and get the length of the result set.

## 4. Development

> This section is for individuals developing the SQLite3 Connector and not intended for end-users.

```sh
npm install
node app.js
```

This project is open source and licensed under the Apache Public License (version 2). Please consider forking this project to improve, enhance or fix issues. If you feel like the community will benefit from your fork, please open a pull request. 
For development purposes use development branch only.

## 5. Running unit and integration tests
```sh
npm test
```
