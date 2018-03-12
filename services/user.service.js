// This is essentially the model for accessing the database through API calls
var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var _ = require('lodash');
var q = require('q');

var str_url = "mongodb://" + 
	process.env.GAMBIT_DB_USER + ":" + 
	process.env.GAMBIT_DB_PASSWORD + 
	"@ds012578.mlab.com:12578/gambit_messenger";

var api_service = {};

api_service.authenticate = authenticate;
api_service.register = register;
api_service.changePassword = changePassword;
api_service.getById = getById;
api_service.update = update;
api_service.delete = _delete;

module.exports = api_service;

function authenticate(username,password) {
	var deferred = q.defer();

	var db = mongo.connect(str_url, function(err, database) {
		database.db('gambit_messenger').collection('users').findOne({username: username}, function(err, user) {
			if(err) deferred.reject(err);

			// Check if return a valid user with username and that password is correct...
			if(user && bcrypt.compareSync(password,user.password)) {

				deferred.resolve(jwt.sign({sub: user._id},process.env.APP_SECRET));
			} else {
				deferred.resolve();
			}
		});
	});

	return deferred.promise;
}

function register(user_parameters) {
	var deferred = q.defer();
	var db = mongo.connect(str_url, function(err, database) {
		const gambit_database = database.db('gambit_messenger');
		gambit_database.collection('users').findOne(
			{username: user_parameters.username}, 
			function(err, user) {
				if(err) deferred.reject(err);

				// If found a registered user with the input username
				if(user) {
					// username already exists
					deferred.reject('Username "' + user_parameters.username + '" is already taken!');
				} else {
					register_user();
			}
		});

		function register_user() {
		// omit so that we can hash it and add in later (for security)
			var user = _.omit(user_parameters, 'password');
			user.password = bcrypt.hashSync(user_parameters.password,10);
			user.registration_date = (new Date()).toLocaleString();

			// now add user to database
			gambit_database.collection('users').insert(user, function(err, records) {
				if(err) {
					console.log(err);
					deferred.reject(err);
				}

				deferred.resolve();
			});

		}
	});

	return deferred.promise;
}

function changePassword(username, new_password) {
	var deferred = q.defer();
	var db = mongo.connect(str_url, function(err, database) {
		var gambit_users = database.db('gambit_messenger').collection('users');
		gambit_users.findOne({username: username}, function(err, user) {
			if(err) deferred.reject(err);

			if(user) {
				update_password();
			} else {
				// Reject because user doesn't exist, so can't change password
				deferred.reject("User: " + username + "  => does not exist!");
			}
		});

		function update_password() {
			var user_info = {};
			user_info.password = bcrypt.hashSync(new_password, 10);

			gambit_users.update({username: username}, {$set: user_info}, function(err, doc, status) {
				if(err) deferred.reject(err);

				deferred.resolve();
			})

		}
	});


	return deferred.promise;
}

function getById(user_id) {
	var deferred = q.defer();
	var db = mongo.connect(str_url, function(err, database) {
		database.db('gambit_messenger').collection('users').findOne({_id:ObjectId(user_id)}, function(err, user) {
			if(err) deferred.reject(err.name + ":" + err.message);

			if(user) {
				deferred.resolve(_.omit(user,'password'));
			} else {
				deferred.resolve();
			}
		});
	});

	return deferred.promise;
}

function update(user_id, user_params) {
	var deferred = q.defer();
	var db = mongo.connect(str_url, function(err, database) {
		var gambit_users = database.db('gambit_messenger').collection('users');
		gambit_users.findOne({_id:ObjectId(user_id)}, function(err, user) {
			if(err) deferred.reject(err);
				// Check if username has changed
			if(user.username !== user_params.username) {
				// Need to check if new username is available.
				gambit_users.findOne({username: user_params.username}, function(err, user) {
					if(err) deferred.reject(err);

					if(user) {
						deferred.reject('Username ' + user_params.username + ' already taken!');
					} else {
						update_user();
					}
				});
			} else {
				update_user();
			}
		});

		function update_user() {
			var user_info_update = {
				username: user_params.username,
				first_name: user_params.first_name,
				last_name: user_params.last_name,
				phone: user_params.phone
			};

			// Check if password also updated
			if(user_params.password) {
				user_info_update.password = bcrypt.hashSync(user_params.password, 10);
			}

			gambit_users.update({_id: ObjectId(user_id)}, {$set: user_info_update}, function(err, doc, status) {
				if(err) deferred.reject(err);

				deferred.resolve();
			});
		}
	});

	return deferred.promise;
}

function _delete(user_id) {
	var deferred = q.defer();
	var db = mongo.connect(str_url, function(err, database) {
		var gambit_users = database.db('gambit_messenger').collection('users');
		gambit_users.remove({_id: ObjectId(user_id)}, function(err) {
			if(err) deferred.reject(err);

			deferred.resolve();
		});
	});
	return deferred.promise;
}