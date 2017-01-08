(function () {
    'use strict';

    angular
        .module('app')
        .directive('showUsers', showUsers);

    function showUsers() {
        return {
            restrict: 'E',
            templateUrl: 'components/show-users/show-users.html',
            controller: 'ShowUsersController',
            controllerAs: 'vm'
        };
    }
})();