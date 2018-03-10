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
				console.log("shouldn't print...");
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

			// now add user to database
			console.log(user);
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

function update() {
	var deferred = q.defer();
	return deferred.promise;
}

function _delete() {
	var deferred = q.defer();
	return deferred.promise;
}