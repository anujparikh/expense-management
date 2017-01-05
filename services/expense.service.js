var jwt = require('jsonwebtoken');
var Q = require('q');
var Expense = require('models/expense');
var User = require('models/user');
var config = require('config.json');
var updateUtil = require('helpers/update');
var _ = require('lodash');

var service = {};

service.addExpense = addExpense;
service.updateExpense = updateExpense;
service.getExpenseBasedOnRole = getExpenseBasedOnRole;
service.deleteExpense = deleteExpense;

/**
 * Add Expense
 * @param currentUserId
 * @param expenseParam
 * @returns {*|promise}
 */
function addExpense(currentUserId, expenseParam) {
    var deferred = Q.defer();
    var newExpense = new Expense({
        description: expenseParam.description,
        amount: expenseParam.amount,
        user: currentUserId,
        comment: expenseParam.comment
    });
    newExpense.save(function (err) {
        console.log('error', err);
        if (err) deferred.reject('An error while adding expense');
        deferred.resolve();
    });

    return deferred.promise;
}

/**
 * Expense update
 * @param _id - expense id created by DB
 * @param expenseParam - expense object with values which needs to be updated
 * @returns {*|promise}
 */
function updateExpense(_id, expenseParam) {
    var deferred = Q.defer();
    Expense.findById(_id, function (err, expense) {
        if (err)
            deferred.reject(err);
        else {
            updateUtil.updateDocument(expense, Expense, expenseParam);
            expense.save(function (err) {
                console.log('error', err);
                if (err) deferred.reject('An error while updating expense');
                deferred.resolve();
            });
        }
    });
    return deferred.promise;
}

/**
 * Fetch expenses based on user role
 * @param queryObj - query parameters that needs to be passed to find method
 * @returns {*|promise}
 */
function getExpenseBasedOnRole(queryObj) {
    var deferred = Q.defer();
    Expense.find(queryObj, function (err, expenses) {
        if (err)
            deferred.reject(err);
        else {
            if (expenses)
                deferred.resolve(expenses);
            else
                deferred.resolve();
        }
    });
    return deferred.promise;
}

/**
 * Delete Expense
 * @param _id - expense id created by DB
 * @returns {*|promise}
 */
function deleteExpense(_id) {
    var deferred = Q.defer();
    Expense.findByIdAndRemove(_id, function (err, expense) {
        if (err) deferred.reject(err);
        expense.remove();
        deferred.resolve();
    });

    return deferred.promise;
}

module.exports = service;