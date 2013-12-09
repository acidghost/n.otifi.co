'use strict';

angular.module('n.coApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'linker/views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('CONFIGS', {
    apiPrefix: '/api/v1'
  });
