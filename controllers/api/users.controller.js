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
	// This function runs after the register.controller sends a request.post for 'api/users/register' 
	// which gets routed to this registerUser function above ^
	// This function will then use userServiceConnection to connect to the model that serves API requests
	// that require database information or changes.
	// userServiceConnetion will called the appropriate 

	// Needs to check to make sure that username doesn't already exist....if so send that info back
	userServiceConnection.register(req.body)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function getCurrentUser(req, res) {
	res.sendStatus(200);
}

function updateUser(req, res) {
	res.sendStatus(200);
}

function deleteUser(req, res) {
	res.sendStatus(200);
}