(function () {
    'use strict';

    angular
        .module('app')
        .factory('ExpenseService', ExpenseService);

    function ExpenseService(UserService, $http, $q, $filter) {
        var service = {};

        service.addExpense = addExpense;
        service.getAllExpenses = getAllExpenses;
        service.getAllExpensesWithTimeFrame = getAllExpensesWithTimeFrame;
        service.updateExpense = updateExpense;
        service.deleteExpense = deleteExpense;

        function addExpense(expense) {
            var deferred = $q.defer();
            $http.post('/api/expenses/add', expense)
                .then(function (res) {
                    deferred.resolve(res);
                }, handleError);
            return deferred.promise;
        }

        function getAllExpenses(start, number, params) {
            var deferred = $q.defer();
            var expenses = [];
            $http.get('/api/expenses/fetch')
                .then(function (res) {
                    expenses = res.data;
                    var filtered = params.search.predicateObject ? $filter('filter')(expenses, params.search.predicateObject) : expenses;
                    if (params.sort.predicate) {
                        filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
                    }
                    var result = filtered.slice(start, start + number);
                    deferred.resolve({
                        data: result,
                        numberOfPages: Math.ceil(filtered.length / number)
                    });
                }, handleError);
            return deferred.promise;
        }

        function getAllExpensesWithTimeFrame(startDate, timeFrame) {
            var deferred = $q.defer();
            var expenses = [];
            $http.get('/api/expenses/fetch?startDate=' + startDate + '&timeFrame=' + timeFrame)
                .then(function (res) {
                    expenses = res.data;
                    deferred.resolve(expenses);
                }, handleError);
            return deferred.promise;
        }

        function updateExpense(expense) {
            var deferred = $q.defer();
            $http.put('/api/expenses/' + expense._id, expense)
                .then(function (res) {
                    deferred.resolve(res);
                }, handleError);
            return deferred.promise;
        }

        function deleteExpense(_id) {
            var deferred = $q.defer();
            $http.delete('/api/expenses/' + _id)
                .then(function (res) {
                    deferred.resolve(res);
                }, handleError);
            return deferred.promise;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }

        return service;
    }
}());
