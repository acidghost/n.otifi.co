'use strict';

var appResources = angular.module('n.coResources', ['ngResource']);

appResources.factory('Artist', ['$resource', 'CONFIGS', function($resource, CONFIGS) {

  return $resource(CONFIGS.apiPrefix+'/artist/:name',
    { name: '@name' })

}]);

appResources.factory('ArtistMultiLoader', ['Artist', '$q', '$route',
  function(Artist, $q, $route) {

    return function() {
      var delay = $q.defer();
      Artist.get({ name: $route.current.params.artist }, function(artists) {
        delay.resolve(artists);
      }, function() {
        delay.reject('Unable to fetch artists...');
      });
      return delay.promise;
    }

  }
]);