// /* global init, assertFailure, dump, state */
// 'use strict';

// require('../_base');
// const should = require('should'),
//     _ = require('underscore'),
//     Arrow = require('Arrow'),
//     utils = require('../../lib/utils/persist'),
//     connector = require('../connector.mock.js'),
//     connect = require('../../lib/utils/connectAndDisconnect');

// describe('Schema', () => {
//     const db = connect.setDatabase(connector.config);
   
//    it('should delete one', (next)=>{
// 	   var table_name = 'sqlite3/Snails';

// 	   should(utils.deleteOne())
//    });
//     // it('should get schema', (next) => {
//     //     should(utils.getSchema(db, function(err, schema){
//     //         should(err).be.not.ok;
//     //         should(schema).be.type('Object');
//     //     }));
//     //     next();
//     // });

//     // it('should get tables', (next)=>{
//     //     should(utils.getTables(db, function(err, tables){
//     //         should(err).be.not.ok;
//     //         should(tables).is.Array;
//     //     }));
//     //     next();
//     // });
// });