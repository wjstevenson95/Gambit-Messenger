require('dotenv').config();
var express = require('express');
var morgan = require('morgan');
var body_parser = require('body-parser');
var mongo_cli = require('mongodb').MongoClient;

var app = express();
var port = 8080;

var gambit_db = require('./config/gambit_db');

app.use(body_parser.urlencoded({ extended: true })); 

app.get('/', (req,res) => {

	console.log(gambit_db.url)
	mongo_cli.connect(gambit_db.url, (err,client) => {
		if(err) throw err;

		var db = client.db('gambit_messenger');
		db.collection('users').find().toArray((err, result) => {
			if(err) throw err;

			res.send(result);
		});
	});

});

app.listen(port);

exports = module.exports = app;