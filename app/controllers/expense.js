var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jwt-simple');
var User = require('../models/user');
var Expense = require('../models/expense');
var updateUtil = require('../helpers/update');
var tokenUtil = require('../helpers/token');
var dateUtil = require('../helpers/date');
var config = require('../config/database');
var apiRoutes = express.Router();

/**
 * Fetch Expenses based on user role
 * @param: token - user token
 * @queryparam (optional):
 *      startDate: date from which expenses needs to be retrieved (mm/dd/yyyy)
 *      timeFrame:  W - weekly
 *                  M - monthly
 *                  Y - annual
 * @link: http://localhost:8080/expense/
 * @method: post
 */
apiRoutes.get('/', passport.authenticate('jwt', {session: false}), function (req, res) {

    var token = tokenUtil.getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function (err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                if (user.role === 'A') {
                    Expense.find({}, function (err, expenses) {
                        if (err) {
                            return res.status(403).send({
                                success: false,
                                msg: 'Authentication failed. User not found.'
                            });
                        }
                        if (!expenses) {
                            return res.status(403).send({success: false, msg: 'No expenses found.'});
                        } else {
                            res.json({success: true, msg: expenses});
                        }
                    });
                } else if (user.role === 'R') {
                    var queryObj = {
                        user: user._id
                    };
                    if (req.query.startDate && req.query.timeFrame) {
                        var startDate = dateUtil.getDateFromString(req.query.startDate);
                        var endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + (req.query.timeFrame === 'W' ? 7 : req.query.timeFrame === 'M' ? 30 : 365));
                        queryObj.time = {
                            "$gte": startDate,
                            "$lte": endDate
                        };
                    }
                    Expense.find(queryObj, function (err, expenses) {
                        if (err) {
                            return res.status(403).send({
                                success: false,
                                msg: 'Authentication failed. User not found.'
                            });
                        }
                        if (!expenses) {
                            return res.status(403).send({success: false, msg: 'No expenses found.'});
                        } else {
                            res.json({success: true, msg: expenses});
                        }
                    });
                } else {
                    res.json({success: false, msg: 'Managers cannot access expenses'});
                }
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

/**
 * Expense Add
 * @param: token - user token
 * @param: description
 * @param: amount
 * @param: comment
 * @link: http://localhost:8080/expense/
 * @method: post
 */
apiRoutes.post('/', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = tokenUtil.getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function (err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                var userExpense = new Expense({
                    description: req.body.description,
                    amount: req.body.amount,
                    user: user._id,
                    comment: req.body.comment
                });

                // save the user
                userExpense.save(function (err) {
                    if (err) {
                        return res.json({success: false, msg: 'Error: ' + err + ' !'});
                    }
                    res.json({success: true, msg: 'Expense saved successfully.'});
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

/**
 * Update Expense
 * @output: updated expense
 * @link: http://localhost:8080/user/<expenseid>
 * @method: put
 */
apiRoutes.put('/:expenseid', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = tokenUtil.getToken(req.headers);
    if (token) {
        Expense.findOneAndUpdate({_id: req.params.expenseid}, {upsert: true}, function (err, expense) {
            if (err) res.status(403).send({success: false, msg: 'Expense update failed.'});
            updateUtil.updateDocument(expense, Expense, req.body);
            expense.save();
            res.json({success: true, msg: expense});
        })
    }
});

/**
 * Remove Expense
 * @link: http://localhost:8080/user/<expenseid>
 * @method: delete
 */
apiRoutes.delete('/:expenseid', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = tokenUtil.getToken(req.headers);
    if (token) {
        Expense.remove({_id: req.params.expenseid}, function (err, expense) {
            if (err) res.status(403).send({success: false, msg: 'Expense delete failed.'});
            res.json({success: true, msg: req.params.expenseid + ' deleted'});
        })
    }
});

module.exports = apiRoutes;