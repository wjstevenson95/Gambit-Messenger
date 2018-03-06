require('dotenv').config();
var express = require('express');
var body_parser = require('body-parser');

var app = express();
var port = 8080;

var gambit_db = require('config/gambit_db');