(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(ExpenseService, UserService) {
        var vm = this;
        vm.displayed = [];

        vm.callServer = function callServer(tableState) {
            vm.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            ExpenseService.getAllExpenses(start, number, tableState)
                .then(function (result) {
                    vm.displayed = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    vm.isLoading = false;
                });
        };

        vm.print = function print(row) {
            console.log(row);
        }
    }
})();
