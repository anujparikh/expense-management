(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    function UserService($http, $q, $filter) {
        var service = {};

        service.fetchCurrentUser = fetchCurrentUser;
        service.fetchAllUsers = fetchAllUsers;
        service.addUser = addUser;
        service.updateUser = updateUser;
        service.deleteUser = deleteUser;

        /**
         * Service function to fetch current user
         * @returns {*|promise}
         */
        function fetchCurrentUser() {
            var deferred = $q.defer();
            $http.get('/api/users/currentuser')
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    deferred.reject(err.data);
                });
            return deferred.promise;
        }

        /**
         * Service function to add user
         * @param user
         * @returns {*|promise}
         */
        function addUser(user) {
            var deferred = $q.defer();
            $http.post('/api/users/register', user)
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    deferred.reject(err.data);
                });
            return deferred.promise;
        }

        /**
         * Service function to fetch all the users
         * @param start
         * @param number
         * @param params
         * @returns {*|promise}
         */
        function fetchAllUsers(start, number, params) {
            var deferred = $q.defer();
            var users = [];
            $http.get('/api/users/fetchall')
                .then(function (res) {
                    users = res.data;
                    users = users.map(function (user) {
                        if (user.role === 'R') user.roleDesc = 'Regular';
                        if (user.role === 'A') user.roleDesc = 'Admin';
                        if (user.role === 'M') user.roleDesc = 'Manager';
                        return user;
                    });
                    var filtered = params.search.predicateObject ? $filter('filter')(users, params.search.predicateObject) : users;
                    if (params.sort.predicate) {
                        filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
                    }
                    var result = filtered.slice(start, start + number);
                    deferred.resolve({
                        data: result,
                        numberOfPages: Math.ceil(filtered.length / number)
                    });
                })
                .catch(function (err) {
                    deferred.reject(err.data);
                });
            return deferred.promise;
        }

        /**
         * Service function to update selected user
         * @param user
         * @returns {*|promise}
         */
        function updateUser(user) {
            var deferred = $q.defer();
            $http.put('/api/users/' + user._id, user)
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    deferred.reject(err.data);
                });
            return deferred.promise;
        }

        /**
         * Service function to delete selected user
         * @param _id
         * @returns {*|promise}
         */
        function deleteUser(_id) {
            var deferred = $q.defer();
            $http.delete('/api/users/' + _id)
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    deferred.reject(err.data);
                });
            return deferred.promise;
        }

        return service;
    }
})();
