'use strict';

angular.module('n.coApp')
  .controller('SearchCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.search = function() {
      $location.path('/search/'+$scope.name);
    };

  }]);