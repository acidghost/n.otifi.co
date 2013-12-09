'use strict';

angular.module('n.coApp', ['n.coResources'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'linker/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/search/:artist', {
        templateUrl: 'linker/views/search.results.html',
        controller: 'SearchResCtrl',
        resolve: {
          artists: function(ArtistMultiLoader) {
            return ArtistMultiLoader();
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('CONFIGS', {
    apiPrefix: '/api/v1'
  });
