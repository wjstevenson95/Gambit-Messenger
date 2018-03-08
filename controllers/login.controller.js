// Controller for user login route
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', (req,res) => {
	// Log out any user
	delete req.session.token;

	var success_data = { success: req.session.success };
	delete req.session.success;

	res.render('login',success_data);
});

router.post('/', (req,res) => {
	console.log(req.body);
	request.post({
		url: process.env.API_URL + '/users/authenticate',
		form: req.body,
		json: true
	}, function(err, response, body) {
		if(err) {
			console.log(err);
			return res.render('login', {error: 'An error occurred!'});
		}

		if(!body.token) {
			return res.render('login', {
				error: "Username or password incorrect",
				email: req.body.email
			});
		}

		//save token
		req.session.token = body.token;

		var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '';
        res.redirect(returnUrl);
	});
});

module.exports = router;