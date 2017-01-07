(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(ExpenseService) {
        var vm = this;
        vm.showExpensesTab = true;
    }
})();
