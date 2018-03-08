// express app controller that controls access to angular app client files

/*
Express app controller controls access to the angular app client files
- Uses session/cookie (req.session.token) authentication to secure
	the agular files, and also exposes a JSON web token (JWT) to be used
	by the angular app to make authenticate API requests (requests to
	routes controlled by users.controller.js)
*/

var express = require('express');
var router = express.Router();


// Use session authorization token to secure the angular app files
/*
Default route '/' redirects to '/app' which is routed to this controller.
*/
router.use('/', (req,res,next) => {
	if(req.path !== '/login' && !req.session.token) {
		return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
	}

	next();
});


/*
In the main entry point file to the angular app (app.js), we send
an AJAX $http GET request to /app/token (which is routed back to this 
controller) so that we can get the 
*/
router.get('/token', (req,res) => {
	res.send(req.session.token);
});

// Serve angular app files for express through the '/' root
router.use('/',express.static('app'));

module.exports = router;