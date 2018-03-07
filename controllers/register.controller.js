// Express controller for user register route
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', (req,res) => {
	res.render('register');
});


router.post('/', (req,res) => {
	// Get information, then make a request to 'api/users/register'
	console.log("Getting to register.controller POST route");
	request.post({
		url: process.env.API_URL + '/users/register',
		form: req.body,
		json: true 
	}, function(err,response,body) {
		if(err) {
			console.log(err);
			return res.render('register', {error: 'An error occurred!'});
		}

		if(response.statusCode !== '200') {
			//
			return res.render('register', {
				error: response.body,
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				phone: req.body.phone
			});
		}

		req.session.succes = "Registration successful!";
		return res.redirect('/login');
	});
});


module.exports = router;