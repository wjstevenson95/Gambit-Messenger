// Express controller for user register route
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', (req,res) => {
	res.render('register');
});


router.post('/', (req,res) => {
	console.log('Not yet implemented!');
	res.redirect('/');
});


module.exports = router;