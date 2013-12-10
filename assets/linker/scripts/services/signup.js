'use strict';

var appServices = angular.module('n.coServices', []);

appServices.service('Signup', ['CONFIGS', '$http', function(CONFIGS, $http) {

  this.register = function(userData) {
    return $http.post('/signup', userData)
      .success(function(data, status, headers, config) {
        return [status, data];
      })
      .error(function(data, status, headers, config) {
        return [status, data];
      });
  };

}]);