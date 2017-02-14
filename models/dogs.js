var Arrow = require('arrow');

var Users = Arrow.Model.extend('Users',{
	fields: {
		name: {type:String},
		email: {type:String},
		age: {type:Number}
	},
	connector: 'appc.sqlite3'
});

module.exports = Users;