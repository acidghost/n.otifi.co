'use strict';

var appServices = angular.module('n.coServices.login', []);

appServices.service('Login', ['$http', '$q', function($http, $q) {

  this.perform = function(email, password) {
    var delay = $q.defer();
    $http.post('/login', { email: email, password: password })
      .success(function(data, status, headers, config) {
        delay.resolve([status, data]);
      })
      .error(function(data, status, headers, config) {
        delay.reject([status, data]);
      });
    return delay.promise;
  };

}]);