var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config.json');

/**
 * User logout
 * @link: http://localhost:8080/login
 * @method: get
 */
router.get('/', function (req, res) {
    // log user out
    delete req.session.token;

    // move success message into local variable so it only appears once (single read)
    var viewData = {success: req.session.success};
    delete req.session.success;

    res.render('login', viewData);
});

/**
 * User Authentication
 * @param: firstName
 * @param: lastName
 * @link: http://localhost:8080/login
 * @method: post
 */
router.post('/', function (req, res) {
    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('login', {error: 'An error occurred'});
        }
        if (!body.token) {
            return res.render('login', {error: 'Username or password is incorrect', username: req.body.username});
        }

        // save JWT token in the session to make it available to the angular app
        req.session.token = body.token;

        // redirect to returnUrl
        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        res.redirect(returnUrl);
    });
});

module.exports = router;
