/**
 * Created by anujparikh on 12/27/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./app/config/database'); // get db config file
var port = process.env.PORT || 8080;

var utils = require('./app/helpers/update');

// get our request parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

app.use(require('./app/controllers'));

// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./app/config/passport')(passport);
