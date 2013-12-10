'use strict';

angular.module('n.coApp')
  .controller('SignupCtrl', ['$scope', 'Signup', function($scope, Signup) {

    $scope.signupFormTemplate = 'linker/views/partials/signup.form.html';

    $scope.user = {};

    $scope.validationErrors = [];

    $scope.success = undefined;
    $scope.payload = undefined;

    $scope.signup = function() {
      var userData = $scope.user;
      delete userData.passRep;

      $scope.validationErrors = [];

      Signup.register(userData)
        .then(function(response) {
          // Success callback
          var payload = response[1];
          $scope.success = payload.success;
          $scope.payload = payload.data;
        },
        function(response) {
          // Error callback
          var payload = response[1];
          $scope.success = payload.success;
          if(payload.message.ValidationError) {
            var errors = payload.message.ValidationError;
            var properties = Object.keys(errors);
            for(var key in Object.keys(errors)) {
              var prop = properties[key];
              var singleErrors = errors[prop];
              for(var i in singleErrors) {
                $scope.validationErrors.push(prop.toUpperCase() + ': ' + singleErrors[i].message);
              }
            }
          } else {
            $scope.validationErrors.push(payload.message);
          }
        });
    };

  }]);