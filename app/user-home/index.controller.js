(function () {
    'use strict';

    angular
        .module('app')
        .controller('userHomeController', userHomeController);

    function userHomeController(UserService) {

        var vm = this;

        init();

        function init() {
            vm.showExpenseBtn = false;
            vm.showUserBtn = false;
            vm.showExpensesTab = false;
            vm.expenseBtnLiteral = 'Show Expenses';
            vm.showUsersTab = false;
            vm.userBtnLiteral = 'Show Users';
            vm.currentUser = {};

            vm.toggleExpensesTab = function () {
                vm.showExpensesTab = !vm.showExpensesTab;
                vm.expenseBtnLiteral = vm.showExpensesTab ? 'Hide Expenses' : 'Show Expenses';
            };

            vm.toggleUsersTab = function () {
                vm.showUsersTab = !vm.showUsersTab;
                if (vm.showUsersTab) {
                    vm.userBtnLiteral = vm.roleOfUser === 'R' ? 'Hide Update User' : 'Hide Users';
                } else {
                    vm.userBtnLiteral = vm.roleOfUser === 'R' ? 'Update User' : 'Show Users';
                }
            };

            /**
             * Fetch current user and display users and expenses based on his role
             */
            UserService.fetchCurrentUser()
                .then(function (result) {
                    vm.currentUser = result.data;
                    vm.roleOfUser = result.data.role;
                    if (vm.roleOfUser === 'R') {
                        vm.showExpenseBtn = true;
                        vm.showUserBtn = true;
                        vm.userBtnLiteral = 'Update User';
                    } else if (vm.roleOfUser === 'M') {
                        vm.showUserBtn = true;
                    } else {
                        vm.showExpenseBtn = true;
                        vm.showUserBtn = true;
                    }
                })
                .catch(function (err) {
                    vm.error = err;
                });
        }
    }
})();
