(function () {
    'use strict';

    angular
        .module('app')
        .controller('ShowExpensesController', ShowExpensesController);

    function ShowExpensesController(ExpenseService, UserService) {
        var vm = this;
        vm.users = [];
        vm.expense = {};
        vm.tableState = {};
        vm.isUpdate = false;
        vm.contentForPrinting = '';
        vm.showPrintTab = false;
        vm.currentUser = {};

        UserService.fetchCurrentUser()
            .then(function (result) {
                vm.currentUser = result.data;
                vm.isRegularUser = result.data.role === 'R';
                vm.error = false;
            })
            .catch(function (err) {
                vm.error = err;
            });

        vm.showPrintForm = function () {
            vm.showPrintTab = !vm.showPrintTab;
        };

        vm.printData = function (startDate, timeFrame) {
            ExpenseService.getAllExpensesWithTimeFrame(startDate, timeFrame)
                .then(function (result) {
                    var timeFrameDesc = timeFrame === 'W' ? 'Weekly' : timeFrame === 'M' ? 'Monthly' : 'Yearly';
                    var timeFrameDays = timeFrame === 'W' ? 7 : timeFrame === 'M' ? 30 : 365;
                    vm.printExpenses = result;
                    vm.totalExpense = _.reduce(vm.printExpenses, function (total, expense) {
                        return total + expense.amount;
                    }, 0);
                    vm.averageExpense = _.round(vm.totalExpense / timeFrameDays, 2);
                    printJS({
                        printable: vm.printExpenses,
                        header: '<b>Print Expenses</b><br><p style="font-size: large">Total ' + timeFrameDesc + ' Expense: ' + vm.totalExpense + '</p>' +
                        '<p style="font-size: large">Average Day Spending: ' + vm.averageExpense + '</p>',
                        type: 'json',
                        properties: ['username', 'description', 'amount', 'comment']
                    });
                    vm.error = false;
                })
                .catch(function (err) {
                    vm.error = err;
                });
        };

        vm.fetchExpenses = function (tableState) {
            vm.tableState = tableState;
            vm.showUpdateForm = false;
            vm.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            ExpenseService.getAllExpenses(start, number, tableState)
                .then(function (result) {
                    vm.expenses = result.data;
                    vm.expenses = vm.expenses.map(function (expense) {
                        expense.date = expense.time.substr(5, 2) + "/" + expense.time.substr(8, 2) + "/" + expense.time.substr(0, 4);
                        expense.timeFrt = expense.time.substr(11, 8);
                        return expense;
                    });
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    vm.isLoading = false;
                    vm.error = false;
                })
                .catch(function (err) {
                    vm.error = err;
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
            vm.showUpdateForm = !vm.showUpdateForm;
            vm.expense = {};
        };

        vm.addOrUpdateExpense = function (expense) {
            if (vm.isUpdate) {
                ExpenseService.updateExpense(expense)
                    .then(function () {
                        vm.expense = {};
                        vm.fetchExpenses(vm.tableState);
                        vm.error = false;
                    })
                    .catch(function (err) {
                        vm.error = err;
                    });
            } else {
                ExpenseService.addExpense(expense)
                    .then(function () {
                        vm.expense = {};
                        vm.fetchExpenses(vm.tableState);
                        vm.error = false;
                    })
                    .catch(function (err) {
                        vm.error = err;
                    });
            }
        };

        vm.deleteExpense = function (_id) {
            ExpenseService.deleteExpense(_id)
                .then(function () {
                    vm.fetchExpenses(vm.tableState);
                    vm.error = false;
                })
                .catch(function (err) {
                    vm.error = err;
                });
        };
    }
})();