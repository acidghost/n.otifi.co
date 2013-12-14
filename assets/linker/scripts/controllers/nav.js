'use strict';

angular.module('n.coApp')
  .controller('NavCtrl', ['$scope', '$location', '$timeout', '$window', 'Login', function ($scope, $location, $timeout, $window, Login) {

    $scope.loggedIn = false;

    $scope.login = function(email, password) {
      Login.perform(email, password)
        .then(function(response) {
          // Success callback
          $scope.loginMessageClass = 'alert-success';
          $scope.loginMessage = 'Successfully logged in!';
          $timeout(function() {
            $('#login-form').slideUp();
            $scope.loggedIn = true;
          }, 2000);
        }, function(response) {
          // Error callback
          $('#login-form .form-group').attr('class', 'form-group has-error');
          $scope.loginMessageClass = 'alert-danger';
          $scope.loginMessage = response[1].message;
          $scope.loggedIn = false;
        });
    };

    $scope.navbarTemplate = "linker/views/partials/navbar.html";

    $window.onload = function() {
      $('.navbar > .collapse').each(function() {
        $(this).collapse({ toggle: false });
        $(this).on('show.bs.collapse', function() {
          var showing = $(this).attr('id');
          $('.navbar > .accordion-group.in').each(function() {
            if($(this).attr('id') != showing) {
              $(this).collapse('hide');
            }
          });
        });
      });
    };

    $scope.search = function(name) {
      $location.path('/search/'+name);
    };

  }]);

