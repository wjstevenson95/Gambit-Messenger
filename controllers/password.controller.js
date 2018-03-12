// Express controller for user change password route
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', (req, res) => {
	res.render('password');
});


router.post('/', (req, res) => {
	if(req.body.new_password !== req.body.confirm_password) {
		return res.render('password', {
			error: "Passwords don't match!",
			username: req.body.username
		});
	} else {
		// Passwords are okay, now make request to API, check username
		console.log("about to make post request....");
		request.post({
			url: process.env.API_URL + '/users/password',
			form: req.body,
			json: true
		}, function(err, response, body) {
			if(err) {
				console.log(err);
				return res.render('password', {error: 'An error occurred!'});
			}

			if(response.statusCode != 200) {
				console.log(response.statusCode);
				return res.render('password', {
					error: response.body,
					username: req.body.username
				});
			}

			// Username checked out, and passwords match, user updated!
			req.session.success = "User password updated!";
			return res.redirect('/login');
		});
	}
});

module.exports = router;