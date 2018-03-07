// Controller for user login route
var express = require('express');
var router = express.Router();
var request = require('require');

router.get('/', (req,res) => {
	// Log out any user
	delete req.session.token;

	var success_data = { success: req.session.success };
	delete req.session.success;

	res.render('login',success_data);
});

router.post('/' (req,res) => {
	console.log("Loggin in not yet implemented!!")
	res.redirect('/');
});

module.exports = router;