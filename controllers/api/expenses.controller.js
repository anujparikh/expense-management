var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var expenseService = require('services/expense.service');
var dateUtil = require('helpers/date');

router.get('/fetch', fetchExpenseBasedOnRole);
router.post('/add', addExpense);
router.put('/:_id', updateExpense);
router.delete('/:_id', deleteExpense);

/**
 * Fetch Expenses controller function
 * @param req - Optional - startDate and timeFrame: W - Weekly, M - Monthly and Y - Year
 * @param res - response object
 */
function fetchExpenseBasedOnRole(req, res) {
    var queryObj = {};
    if (req.user.role === 'R')
        queryObj.user = req.user.sub;
    if (req.query.startDate && req.query.timeFrame) {
        var startDate = dateUtil.getDateFromString(req.query.startDate);
        var endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (req.query.timeFrame === 'W' ? 7 : req.query.timeFrame === 'M' ? 30 : 365));
        queryObj.time = {
            "$gte": startDate,
            "$lte": endDate
        };
    }
    expenseService.getExpenseBasedOnRole(queryObj)
        .then(function (expenses) {
            res.send(expenses);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Add Expense controller function
 * @param req - request object
 * @param: description
 * @param: amount
 * @param: comment
 * @param res - response
 */
function addExpense(req, res) {
    var username = req.body.username ? req.body.username : req.user.username;
    expenseService.addExpense(username, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Update Expense Controller function
 * @param req - object with all the fields required to be updated
 * @param res - response object
 */
function updateExpense(req, res) {
    expenseService.updateExpense(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

/**
 * Delete Expense Controller function
 * @param req - empty
 * @param res - response
 */
function deleteExpense(req, res) {
    expenseService.deleteExpense(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports = router;