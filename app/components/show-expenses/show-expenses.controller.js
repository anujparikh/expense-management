(function () {
    'use strict';

    angular
        .module('app')
        .controller('ShowExpensesController', ShowExpensesController);

    function ShowExpensesController(ExpenseService) {
        var vm = this;
        vm.users = [];
        vm.expense = {};
        vm.tableState = {};
        vm.isUpdate = false;

        vm.callServer = function (tableState) {
            vm.tableState = tableState;
            vm.showUpdateForm = false;
            vm.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            ExpenseService.getAllExpenses(start, number, tableState)
                .then(function (result) {
                    vm.expenses = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    vm.isLoading = false;
                });
        };

        vm.showExpense = function (row) {
            vm.showUpdateForm = true;
            vm.isUpdate = true;
            vm.expense._id = row._id;
            vm.expense.username = row.username;
            vm.expense.amount = row.amount;
            vm.expense.comment = row.comment;
            vm.expense.description = row.description;
        };

        vm.cancel = function () {
            vm.showUpdateForm = !vm.showUpdateForm
            vm.expense = {};
        };

        vm.addOrUpdateExpense = function (expense) {
            if (vm.isUpdate) {
                ExpenseService.updateExpense(expense)
                    .then(function () {
                        vm.expense = {};
                        vm.callServer(vm.tableState);
                    });
            } else {
                ExpenseService.addExpense(expense)
                    .then(function () {
                        vm.expense = {};
                        vm.callServer(vm.tableState);
                    });
            }
        };

        vm.deleteExpense = function (_id) {
            ExpenseService.deleteExpense(_id)
                .then(function () {
                    vm.callServer(vm.tableState);
                });
        }
    }
})();