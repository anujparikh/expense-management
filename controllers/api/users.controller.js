var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userService = require('services/user.service');

// user api routes
router.get('/currentuser', getCurrentUser);
router.get('/fetchall', fetchAllUser);
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

/**
 * User Authentication Controller function
 * @param req - object with username and password
 * @param res - response
 */
function authenticateUser(req, res) {
    userService.authenticateUser(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                res.send({token: token});
            } else {
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * User Registration Controller function
 * @param req - object with all the required fields
 * @param res - response
 */
function registerUser(req, res) {
    userService.createUser(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Get Current User Controller function
 * @param req
 * @param res
 */
function getCurrentUser(req, res) {
    userService.currentUser(req.user.sub)
        .then(function (user) {
            res.send(user);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Fetch User Controller function
 * @param req - empty
 * @param res - response object
 */
function fetchAllUser(req, res) {
    userService.fetchAllUser()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Update User Controller function
 * @param req - object with all the fields required to be updated
 * @param res - response object
 */
function updateUser(req, res) {
    var userId = req.user.sub;
    var role = req.user.role;
    if (role === 'R' && req.params._id !== userId) {
        return res.status(401).send('Role access denied for updating user');
    }
    userService.updateUser(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Delete User controller function
 * @param req - empty
 * @param res - response
 */
function deleteUser(req, res) {
    var userId = req.user.sub;
    var role = req.user.role;
    if (role === 'R' && req.params._id !== userId) {
        return res.status(401).send('Role access denied for deleting user');
    }
    userService.deleteUser(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports = router;