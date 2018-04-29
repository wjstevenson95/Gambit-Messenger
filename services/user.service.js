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
api_service.getCurrentBlogs = getCurrentBlogs;
api_service.submitBlog = submitBlog;
api_service.addContact = addContact;
api_service.acceptContact = acceptContact;
api_service.removeContact = removeContact;
api_service.declineContact = declineContact;
api_service.getContactInfo = getContactInfo;
api_service.update = update;
api_service.delete = _delete;

module.exports = api_service;

function authenticate(username,password) {
	var deferred = q.defer();

	mongo.connect(str_url, function(err, database) {
		database.db('gambit_messenger').collection('users').findOne({username: username}, function(err, user) {
			if(err) {
				deferred.reject(err);
				return deferred.promise;
			}
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
	mongo.connect(str_url, function(err, database) {
		const gambit_database = database.db('gambit_messenger');
		gambit_database.collection('users').findOne(
			{username: user_parameters.username}, 
			function(err, user) {
				if(err) {
					deferred.reject(err);
					return deferred.promise;
				}
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
			user.contacts = [];
			user.pending = [];

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
	mongo.connect(str_url, function(err, database) {
		var gambit_users = database.db('gambit_messenger').collection('users');
		gambit_users.findOne({username: username}, function(err, user) {
			if(err) {
				deferred.reject(err);
				return deferred.promise;
			}

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
	mongo.connect(str_url, function(err, database) {
		database.db('gambit_messenger').collection('users').findOne({_id:ObjectId(user_id)}, function(err, user) {
			if(err) {
				deferred.reject(err.name + ":" + err.message);
				return deferred.promise;
			}

			if(user) {
				deferred.resolve(_.omit(user,'password'));
			} else {
				deferred.resolve();
			}
		});
	});

	return deferred.promise;
}

function getCurrentBlogs() {
	var deferred = q.defer();
	mongo.connect(str_url, function(err, database) {
		database.db('gambit_messenger').collection('blogs').find({}).toArray(function(err, results) {
			if(err) {
				deferred.reject(err);
				return deferred.promise;
			}

			deferred.resolve(results);
		});
	});

	return deferred.promise;
}

function submitBlog(blog) {
	console.log("got to service...");
	var deferred = q.defer();
	mongo.connect(str_url, function(err, database) {
		database.db('gambit_messenger').collection('blogs').insert(blog, function(err, docs) {
			if(err) {
				deferred.reject(err);
				return deferred.promise;
			}

			deferred.resolve();
		})
	})

	return deferred.promise;
}

function addContact(contact_username, current_user) {
	var deferred = q.defer();
	mongo.connect(str_url, function(err, database) {
		gambit_users = database.db('gambit_messenger').collection('users');
		// Check if username exists...
		gambit_users.findOne({username: contact_username}, function(err, user) {
			if(err) {
				deferred.reject(err);
				return deferred.promise;
			}

			if(user) {
				// Check if already friends or already a pending request
				gambit_users.findOne({
					$or: [
						{
							username: current_user.username,
							contacts: {id: ObjectId(user._id)}
						},
						{
							username: contact_username,
							pending: {id: ObjectId(current_user._id)}
						}
					]
				}, function(err,user2) {
					if(err) {
						deferred.reject(err);
						return deferred.promise;
					}

					if(user2) {
						deferred.reject("Already friends or existing request!");
						return deferred.promise;
					}

					// Now add your own object id to contact_usernames pending
					gambit_users.update(
						{username: contact_username},
						{$push: {
							pending: {id: ObjectId(current_user._id)}
						}},
						function(err, count, status) {
							if(err) {
								deferred.reject(err);
								return deferred.promise;
							}

							deferred.resolve();
						});

				});
			} else {
				deferred.reject("User " + contact_username + " doesn't exist!");
			}
		})
	});

	return deferred.promise;
}

function removeContact(user_id, contact_id) {
	var deferred = q.defer();

	mongo.connect(str_url, function(err, database) {
		var gambit_users = database.db('gambit_messenger').collection('users');

		gambit_users.update(
			{_id: ObjectId(user_id)},
			{$pull: {
				contacts: {id: ObjectId(contact_id)}
			}},
			function(err, count, status) {
				if(err) {
					deferred.reject(err);
					return deferred.promise;
				}
			});

		gambit_users.update(
			{_id: ObjectId(contact_id)},
			{$pull: {
				contacts: {id: ObjectId(user_id)}
			}},
			function(err, count, status) {
				if(err) {
					deferred.reject(err);
					return deferred.promise;
				}

				deferred.resolve();
			});
	});

	return deferred.promise;
}

function acceptContact(user_id, contact_id) {
	var deferred = q.defer();
	// Remove from contact pending and your pending. Add to contact friends and your friends
	mongo.connect(str_url, function(err, database) {
		var gambit_users = database.db('gambit_messenger').collection('users');

		// Remove contact from current user's pending list
		gambit_users.update(
			{_id: ObjectId(user_id)},
			{$pull: {
				pending: {id: ObjectId(contact_id)}
			}},
			function(err, count, status) {
				if(err) {
					deferred.reject(err);
					return deferred.promise;
				}
			});

		// Add to current contacts
		gambit_users.update(
			{_id: ObjectId(user_id)},
			{$push: {
				contacts: {id: ObjectId(contact_id)}
			}},
			function(err,count,status) {
				if(err) {
					deferred.reject(err);
					return deferred.promise;
				}
			});

		// Add to contact's list
		gambit_users.update(
			{_id: ObjectId(contact_id)},
			{$push: {
				contacts: {id: ObjectId(user_id)}
			}},
			function(err,count,status) {
				if(err) {
					deferred.reject(err);
					return deferred.promise;
				}

				deferred.resolve();
			});
	});

	return deferred.promise;

}

function declineContact(user_id, contact_id) {
	var deferred = q.defer();
	// Remove from contact pending and your pending.
	mongo.connect(str_url, function(err, database) {
		var gambit_users = database.db('gambit_messenger').collection('users');

		gambit_users.update(
			{_id: ObjectId(user_id)},
			{$pull: {
				pending: {id: ObjectId(contact_id)}
			}},
			function(err, count, status) {
				if(err) {
					deferred.reject(err);
					return deferred.promise;
				}

				deferred.resolve();
			});
	});

	return deferred.promise;
}

function getContactInfo(contact_id) {
	var deferred = q.defer();
	mongo.connect(str_url, function(err, database) {
		var gambit_users = database.db('gambit_messenger').collection('users');
		gambit_users.findOne({_id: ObjectId(contact_id)}, function(err, contact) {
			if(err) {
				deferred.reject(err);
				return deferred.promise;
			}

			if(contact) {
				deferred.resolve(_.omit(contact, 'password'));
			} else {
				deferred.resolve();
			}
		});
	});

	return deferred.promise;

}

function update(user_id, user_params) {
	var deferred = q.defer();
	mongo.connect(str_url, function(err, database) {
		var gambit_users = database.db('gambit_messenger').collection('users');
		gambit_users.findOne({_id:ObjectId(user_id)}, function(err, user) {
			if(err) {
				deferred.reject(err);
				return deferred.promise;
			}
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
	mongo.connect(str_url, function(err, database) {
		var gambit_users = database.db('gambit_messenger').collection('users');
		gambit_users.remove({_id: ObjectId(user_id)}, function(err) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});
	});
	return deferred.promise;
}