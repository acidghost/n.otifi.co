'use strict';

angular.module('n.coApp')
  .controller('SignupCtrl', ['$scope', 'Signup', function($scope, Signup) {

    $scope.signupFormTemplate = 'linker/views/partials/signup.form.html';

    $scope.user = {};

    $scope.signup = function() {
      var userData = $scope.user;
      delete userData.passRep;
      var resp = Signup.register(userData);
      console.log(resp);
    };

  }]);