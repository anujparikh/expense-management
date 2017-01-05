require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var expressJwt = require('express-jwt');
var config = require('config.json'); // get db config file
var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({secret: config.secret, resave: false, saveUninitialized: true}));
app.use(morgan('dev'));
app.use('/api', expressJwt({secret: config.secret}).unless({path: ['/api/users/authenticate', '/api/users/register']}));

// Use the passport package in our application
app.use(passport.initialize());

// routes
app.use('/login', require('controllers/login.controller'));
app.use('/register', require('controllers/register.controller'));
app.use('/app', require('controllers/app.controller'));
app.use('/api/users', require('controllers/api/users.controller'));
app.use('/api/expenses', require('controllers/api/expenses.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://localhost:' + port);
});

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
// require('passport')(passport);
