var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jwt-simple');
var User = require('../models/user');
var updateUtil = require('../helpers/update');
var tokenUtil = require('../helpers/token');
var config = require('../config/database'); // get db config file
var apiRoutes = express.Router();

/**
 * Get All Users
 * @output: users
 * @link: http://localhost:8080/user/
 * @method: get
 */
apiRoutes.get('/', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = tokenUtil.getToken(req.headers);
    if (token) {
        User.find({}, function (err, users) {
            if (err) throw err;

            if (!users) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, msg: users});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

/**
 * User Signup
 * @param: name - username
 * @param: password
 * @param: admin - boolean
 * @param: role - (M - manager, A - admin, R - regular)
 * @link: http://localhost:8080/user/signup
 * @method: post
 */
apiRoutes.post('/signup', function (req, res) {
    if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            name: req.body.name,
            password: req.body.password,
            admin: req.body.admin,
            role: req.body.role
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({success: false, msg: err});
            }
            res.json({success: true, msg: 'Successful created new user.', user: newUser});
        });
    }
});

/**
 * User Authenticate
 * @param: name - username
 * @param: password
 * @output: token
 * @link: http://localhost:8080/user/authenticate
 * @method: post
 */
apiRoutes.post('/authenticate', function (req, res) {
    User.findOne({
        name: req.body.name
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, config.secret); // if user is found and password is right create a token
                    res.json({success: true, token: 'JWT ' + token}); // return the information including token as JSON
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

/**
 * Update User
 * @output: updated user
 * @link: http://localhost:8080/user/<username>
 * @method: put
 */
apiRoutes.put('/:username', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = tokenUtil.getToken(req.headers);
    if (token) {
        User.findOneAndUpdate({name: req.params.username}, {upsert: true}, function (err, user) {
            if (err) res.status(403).send({success: false, msg: 'User update failed.'});
            updateUtil.updateDocument(user, User, req.body);
            user.save();
            res.json({success: true, msg: user});
        })
    }
});

/**
 * Remove User
 * @link: http://localhost:8080/user/<username>
 * @method: delete
 */
apiRoutes.delete('/:username', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = tokenUtil.getToken(req.headers);
    if (token) {
        User.findOneAndRemove({name: req.params.username}, function (err, user) {
            if (err) res.status(403).send({success: false, msg: 'User delete failed.'});
            user.remove();
            res.json({success: true, msg: req.params.username + ' deleted'});
        })
    }
});

module.exports = apiRoutes;