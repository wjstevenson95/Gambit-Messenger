// This is essentially the model for accessing the database through API calls
var mongo = require('mongodb').MongoClient;
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
api_service.getById = getById;
api_service.register = register;
api_service.update = update;
api_service.delete = _delete;

module.exports = api_service;

function authenticate(email,password) {
	var deferred = q.defer();

	var db = mongo.connect(str_url, function(err, database) {
		const gambit_database = database.db('gambit_messenger');
		gambit_database .collection('users').findOne({email: email}, function(err, user) {
			if(err) deferred.reject(err);

			// Check if return a valid user with email and that password is correct...
			if(user && bcrypt.compareSync(password,user.password)) {
				deferred.resove(jwt.sign({sub: user._id},process.env.APP_SECRET));
			} else {
				deferred.resolve();
			}
		});
	});

	return deferred.promise;
}

async function register(user_parameters) {
	var deferred = q.defer();
	console.log(user_parameters.email);
	var db = mongo.connect(str_url, function(err, database) {
		const gambit_database = database.db('gambit_messenger');
		gambit_database.collection('users').findOne(
			{email: user_parameters.email}, 
			function(err, user) {
				if(err) deferred.reject(err);

				// If found a registered user with the input email
				if(user) {
					// username already exists
					deferred.reject('Email "' + user_parameters.email + '" is already taken!');
				} else {
					register_user();
			}
		});

		async function register_user() {
		// omit so that we can hash it and add in later (for security)
			var user = _.omit(user_parameters, 'password');
			user.password = bcrypt.hashSync(user_parameters.password,10);

			// now add user to database
			console.log(user);
			await gambit_database.collection('users').insert(user, function(err, records) {
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

function getById() {
	var deferred = q.defer();
	return deferred.promise;
}

function update() {
	var deferred = q.defer();
	return deferred.promise;
}

function _delete() {
	var deferred = q.defer();
	return deferred.promise;
}