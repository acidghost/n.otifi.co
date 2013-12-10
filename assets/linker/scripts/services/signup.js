'use strict';

var appServices = angular.module('n.coServices', []);

appServices.service('Signup', ['CONFIGS', '$http', '$q', function(CONFIGS, $http, $q) {

  this.register = function(userData) {
    var delay = $q.defer();
    $http.post('/signup', userData)
      .success(function(data, status, headers, config) {
        delay.resolve([status, data]);
      })
      .error(function(data, status, headers, config) {
        delay.reject([status, data]);
      });
    return delay.promise;
  };

}]);