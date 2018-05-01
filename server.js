//require('dotenv').config();
require('rootpath')();
var app = require('express')();
var server = require('http').createServer(app);
var session = require('express-session');
var io = require('socket.io')(server);

var morgan = require('morgan');
var body_parser = require('body-parser');
var expressJwt = require('express-jwt');


app.set('view engine','ejs');
app.set('views',__dirname + '/views');
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(morgan('dev'));
app.use(session({secret: process.env.APP_SECRET, resave: true, saveUninitialized: false}));

// use JWT auth to secure API
app.use('/api',expressJwt({secret: process.env.APP_SECRET}).unless({path: ['/api/users/authenticate','/api/users/register','/api/users/password']}));


//routes
app.use('/login',require('./controllers/login.controller'));
app.use('/register',require('./controllers/register.controller'));
app.use('/password', require('./controllers/password.controller'));
app.use('/app',require('./controllers/app.controller'));
app.use('/api/users',require('./controllers/api/users.controller'));

// '/app' is default route (remember SPA)
app.get('/', (req,res) => {
	return res.redirect('/app');
});

server.listen(process.env.PORT, () => {
	console.log('Server listening at localhost on port 8080');
});