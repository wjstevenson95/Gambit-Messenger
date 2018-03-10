// express app users api controller defines routes responsible for user
// related operations like authentication, registration, retrieving,
// updating and deleting user data
var express = require('express');
var router = express.Router();

// This require will return the module.exports = api_service, which gives access to.
// authenticate, register, getById, update, _delete
var userServiceConnection = require('services/user.service');

//routes
router.post('/authenticate',authenticateUser);
router.post('/register',registerUser);
router.get('/current',getCurrentUser);
router.put('/:_id',updateUser);
router.delete('/:_id',deleteUser);

// expose routes
module.exports = router;

function authenticateUser(req, res) {
	userServiceConnection.authenticate(req.body.username,req.body.password)
		.then(function(token) {
			if(token) {
				res.send({token: token});
			} else {
				res.status(401).send("Username or password is incorrect");
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function registerUser(req, res) {
	userServiceConnection.register(req.body)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function getCurrentUser(req, res) {
	console.log("getting here...");
	userServiceConnection.getById(req.user.sub)
		.then(function(user) {
			if(user) {
				res.send(user);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function updateUser(req, res) {
	res.sendStatus(200);
}

function deleteUser(req, res) {
	res.sendStatus(200);
}