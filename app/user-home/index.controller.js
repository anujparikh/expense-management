(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller() {
        var vm = this;
        vm.showExpensesTab = false;
        vm.expenseBtnLiteral = 'Show Expenses';
        vm.showUsersTab = false;
        vm.userBtnLiteral = 'Show Users';

        vm.toggleExpensesTab = function () {
            vm.showExpensesTab = !vm.showExpensesTab;
            vm.expenseBtnLiteral = vm.showExpensesTab ? 'Hide Expenses' : 'Show Expenses';
        };

        vm.toggleUsersTab = function () {
            vm.showUsersTab = !vm.showUsersTab;
            vm.userBtnLiteral = vm.showUsersTab ? 'Hide Users' : 'Show Users';
        };
    }
})();
