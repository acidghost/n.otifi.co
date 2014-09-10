'use strict';

angular.module('n.coApp', ['ngRoute', 'n.coResources', 'n.coServices', 'n.coDirectives'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'linker/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/signup', {
        templateUrl: 'linker/views/signup.html',
        controller: 'SignupCtrl'
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
    appName: 'n.otifi.co',
    apiPrefix: '/api/v1'
  })
  .run(function($rootScope, CONFIGS) {
    $rootScope.CONFIGS = CONFIGS;

    $rootScope.isViewLoading = false;
    $rootScope.$on('$routeChangeStart', function() {
      $rootScope.isViewLoading = true;
      console.log("Route start");
    });
    $rootScope.$on('$routeChangeSuccess', function() {
      $rootScope.isViewLoading = false;
      console.log("Route success");
    });
    $rootScope.$on('$routeChangeError', function() {
      $rootScope.isViewLoading = false;
      console.log("Route error");
    });
  });
