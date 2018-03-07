require('dotenv').config();
require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var body_parser = require('body-parser');
var morgan = require('morgan');
var expressJwt = require('express-jwt');


app.set('view engine','ejs');
app.set('views',__dirname + '/views');
app.use(morgan('dev'));
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
ap.use(session({secret: process.env.APP_SECRET, resave: true, saveUninitialized: false}));

// use JWT auth to secure API
app.use('/api',expresJwt({secret: process.env.APP_SECRET}).unless({path: ['/api/users/authenticate','/api/users/register']}));


//routes
app.use('/login',require('./controllers/login.controller'));
app.use('/register',require('./controllers/register.controller'));
app.use('/app',require('./controllers/app.controller'));
app.use('/api/users',require('./controllers/api/users.controller'));

// '/app' is default route (remember SPA)
app.get('/', (req,res) => {
	return res.redirect('/app');
};

var server = app.listen(8080, () => {
	console.log('Server listening at http://' + server.address().address + ":" + server.address().port);
});