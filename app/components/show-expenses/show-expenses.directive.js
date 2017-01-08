(function () {
    'use strict';

    angular
        .module('app')
        .directive('showExpenses', showExpenses);

    function showExpenses() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'components/show-expenses/show-expenses.html',
            controller: 'ShowExpensesController',
            controllerAs: 'vm'
        };
    }
})();