(function () {
    'use strict';

    angular
        .module('app')
        .controller('ShowUsersController', ShowUsersController);

    function ShowUsersController(UserService) {
        var vm = this;
        vm.users = [];
        vm.user = {};
        vm.tableState = {};
        vm.isUpdate = false;

        /**
         * Fetch users based on role and feed data to smart table
         * @param tableState
         */
        vm.fetchUsers = function (tableState) {
            vm.tableState = tableState;
            vm.showUpdateForm = false;
            vm.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            UserService.fetchAllUsers(start, number, tableState)
                .then(function (result) {
                    vm.users = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    vm.isLoading = false;
                    vm.error = false;
                })
                .catch(function (err) {
                    vm.error = err;
                });
        };

        /**
         * helper function to show data on click of row in table
         * @param row - user object
         */
        vm.showUser = function (row) {
            vm.showUpdateForm = true;
            vm.isUpdate = true;
            vm.user._id = row._id;
            vm.user.firstName = row.firstName;
            vm.user.lastName = row.lastName;
            vm.user.username = row.username;
            vm.user.role = row.role;
        };

        vm.cancel = function () {
            vm.showUpdateForm = !vm.showUpdateForm;
            vm.user = {};
        };

        /**
         * Function to add or update the user based on user action
         * For addition, default passed for new user would be 'default'
         * @param user - user object
         */
        vm.addOrUpdateUser = function (user) {
            if (vm.isUpdate) {
                UserService.updateUser(user)
                    .then(function () {
                        vm.user = {};
                        vm.fetchUsers(vm.tableState);
                        vm.error = false;
                    })
                    .catch(function (err) {
                        vm.error = err;
                    });
            } else {
                user.password = 'default';
                user.rePassword = 'default';
                UserService.addUser(user)
                    .then(function () {
                        vm.user = {};
                        vm.fetchUsers(vm.tableState);
                        vm.error = false;
                    })
                    .catch(function (err) {
                        vm.error = err;
                    });
            }
        };

        /**
         * Delete User
         * @param _id
         */
        vm.deleteUser = function (_id) {
            UserService.deleteUser(_id)
                .then(function () {
                    vm.fetchUsers(vm.tableState);
                    vm.error = false;
                })
                .catch(function (err) {
                    vm.error = err;
                });
        }
    }
})();