(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    function UserService($http, $q, $filter) {
        var service = {};

        service.fetchAllUsers = fetchAllUsers;
        service.addUser = addUser;
        service.updateUser = updateUser;
        service.deleteUser = deleteUser;

        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.GetCurrent = GetCurrent;

        return service;

        function GetCurrent() {
            return $http.get('/api/users/currentuser').then(handleSuccess, handleError);
        }

        function addUser(user) {
            var deferred = $q.defer();
            $http.post('/api/users/register', user)
                .then(function (res) {
                    deferred.resolve(res);
                }, handleError);
            return deferred.promise;
        }

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
                }, handleError);
            return deferred.promise;
        }

        function updateUser(user) {
            var deferred = $q.defer();
            $http.put('/api/users/' + user._id, user)
                .then(function (res) {
                    deferred.resolve(res);
                }, handleError);
            return deferred.promise;
        }

        function deleteUser(_id) {
            var deferred = $q.defer();
            $http.delete('/api/users/' + _id)
                .then(function (res) {
                    deferred.resolve(res);
                }, handleError);
            return deferred.promise;
        }

        function GetById(_id) {
            return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
