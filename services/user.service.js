var jwt = require('jsonwebtoken');
var Q = require('q');
var User = require('models/user');
var config = require('config.json');
var updateUtil = require('helpers/update');
var _ = require('lodash');

var service = {};

service.authenticateUser = authenticateUser;
service.createUser = createUser;
service.fetchAllUser = fetchAllUsers;
service.updateUser = updateUser;
service.deleteUser = deleteUser;

/**
 * Creates and stores new user in DB
 * @param userParam - user request object
 * @returns {*|promise}
 */
function createUser(userParam) {
    var deferred = Q.defer();
    User.findOne({username: userParam.username}, function (err, user) {
        if (err) deferred.reject(err);
        if (user) {
            deferred.reject('Username "' + userParam.username + '" is already taken');
        } else {
            create();
        }
    });
    function create() {
        var newUser = new User({
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
            password: userParam.password,
            admin: userParam.admin,
            role: userParam.role
        });
        // save the user
        newUser.save(function (err) {
            console.log('error', err);
            if (err) deferred.reject('An error while registering user');
            deferred.resolve();
        });
    }

    return deferred.promise;
}

/**
 * User Authentication
 * @param username
 * @param password
 * @returns {*|promise}
 */
function authenticateUser(username, password) {
    var deferred = Q.defer();
    User.findOne({username: username}, function (err, user) {
        if (err) deferred.reject(err);
        if (!user) {
            deferred.reject('Authentication failed. User not found.');
        } else {
            user.comparePassword(password, function (err, isMatch) {
                if (isMatch && !err) {
                    // Authentication Successful
                    var token = jwt.sign({sub: user._id, role: user.role}, config.secret);
                    deferred.resolve(token);
                } else {
                    // Authentication failed
                    deferred.resolve();
                }
            })
        }
    });

    return deferred.promise;
}

/**
 * Fetch all the users
 * @returns {*|promise}
 */
function fetchAllUsers() {
    var deferred = Q.defer();
    var fetchedUsers;
    User.find({}, function (err, users) {
        if (err)
            deferred.reject(err);
        else {
            if (users)
                deferred.resolve(users);
            else
                deferred.resolve();
        }
    });
    return deferred.promise;
}

/**
 * User update
 * @param _id - user id created by DB
 * @param userParam - user object with values which needs to be updated
 * @returns {*|promise}
 */
function updateUser(_id, userParam) {
    var deferred = Q.defer();
    User.findById(_id, function (err, user) {
        var fetchUser = user;
        if (err) deferred.reject(err);
        if (user.username !== userParam.username) {
            User.findOne({username: userParam.username}, function (err, user) {
                if (err) deferred.reject(err);
                if (user) {
                    deferred.reject('Username "' + userParam.username + '" is already taken');
                } else {
                    update(fetchUser);
                }
            });
        }
    });

    function update(user) {
        updateUtil.updateDocument(user, User, userParam);
        user.save(function (err) {
            console.log('error', err);
            if (err) deferred.reject('An error while updating user');
            deferred.resolve();
        });
    }

    return deferred.promise;
}

/**
 * Delete update
 * @param _id - user id created by DB
 * @returns {*|promise}
 */
function deleteUser(_id) {
    var deferred = Q.defer();
    User.findByIdAndRemove(_id, function (err, user) {
        if (err) deferred.reject(err);
        user.remove();
        deferred.resolve();
    });

    return deferred.promise;
}

module.exports = service;

