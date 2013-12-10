'use strict';

var appDirectives = angular.module('n.coDirectives', []);

appDirectives.directive('passConfirm', function() {

  return {
    require: 'ngModel',
    scope: {
      passConfirm: '='
    },
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue, $scope) {
        var origin = scope.passConfirm;
        var match = (viewValue == origin);
        if(match) {
          ctrl.$setValidity('pass-match', true);
          return true;
        } else {
          ctrl.$setValidity('pass-match', false);
          return false;
        }
      })
    }
  };

});
