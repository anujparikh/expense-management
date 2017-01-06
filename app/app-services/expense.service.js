(function () {
    'use strict';

    angular
        .module('app')
        .factory('ExpenseService', ExpenseService);

    function ExpenseService(UserService, $http, $q, $filter) {
        var service = {};

        service.getAllExpenses = getAllExpenses;
        service.updateExpense = updateExpense;

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

        function updateExpense() {

        }

        function handleError(res) {
            return $q.reject(res.data);
        }

        return service;
    }
}());
