'use strict';

angular.module('n.coApp')
  .controller('SearchResCtrl', function($scope, artists) {

    $scope.artists = artists.data;

  });