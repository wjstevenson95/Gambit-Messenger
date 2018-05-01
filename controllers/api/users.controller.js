// express app users api controller defines routes responsible for user
// related operations like authentication, registration, retrieving,
// updating and deleting user data
var express = require('express');
var router = express.Router();

// This require will return the module.exports = api_service, which gives access to.
// authenticate, register, getById, update, _delete
var userServiceConnection = require('./services/user.service');

//routes
router.post('/authenticate',authenticateUser);
router.post('/register',registerUser);
router.post('/password',changePassword);
router.get('/current',getCurrentUser);
router.get('/current_blogs',getCurrentBlogs);
router.put('/submit_blog',submitBlog);
router.put('/add_contact',addContact);
router.put('/remove_contact',removeContact);
router.put('/accept',acceptContact);
router.put('/decline',declineContact);
router.get('/get_contact/:id',getContactInfo);
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


function changePassword(req, res) {
	console.log("getting to API change password controller");
	userServiceConnection.changePassword(req.body.username, req.body.new_password)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function getCurrentUser(req, res) {
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

function getCurrentBlogs(req, res) {
	userServiceConnection.getCurrentBlogs()
		.then(function(blogs) {
			if(blogs) {
				res.send(blogs);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		})
}

function submitBlog(req, res) {
	userServiceConnection.submitBlog(req.body)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function addContact(req, res) {
	//req.body should be contact_username
	userServiceConnection.addContact(req.body.contact_username, req.body.user)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function removeContact(req, res) {
	userServiceConnection.removeContact(req.body.user_id, req.body.contact_id)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		})
}

function acceptContact(req, res) {
	userServiceConnection.acceptContact(req.body.user_id, req.body.contact_id)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function declineContact(req, res) {
	userServiceConnection.declineContact(req.body.user_id, req.body.contact_id)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function getContactInfo(req, res) {
	userServiceConnection.getContactInfo(req.params.id)
		.then(function(contact) {
			if(contact) {
				res.send(contact);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function updateUser(req, res) {
	var user_id = req.user.sub;
	if(req.params._id !== user_id) {
		// can only update your own account
		res.status(401).send('You can only update your own account');
	}

	userServiceConnection.update(user_id, req.body)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
	});
}

function deleteUser(req, res) {
	userServiceConnection.delete(req.params._id)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}








