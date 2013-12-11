'use strict';

angular.module('n.coApp')
  .controller('NavCtrl', ['$scope', '$location', '$timeout', 'Login', function ($scope, $location, $timeout, Login) {

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

    $scope.navigate = function(where) {
      $location.path(where);
    };

    $scope.open = function(what) {
      var allHidden = !$('#login-form').is(':visible') && !$('#search-form').is(':visible');

      var slideOptions = {
        duration: 300,
        easing: 'swing'
      }

      if(allHidden) {
        if(what == 'login') {
          $('#login-form').slideToggle(slideOptions);
        } else if(what == 'search') {
          $('#search-form').slideToggle(slideOptions);
        }
      } else {
        if(what == 'login') {
          if($('#search-form').is(':visible')) {
            slideOptions.complete = function() {
              delete slideOptions.complete;
              $('#login-form').slideToggle(slideOptions);
            };
            $('#search-form').slideUp(slideOptions);
          } else {
            $('#login-form').slideToggle(slideOptions);
          }
        } else if(what == 'search') {
          if($('#login-form').is(':visible')) {
            slideOptions.complete = function() {
              delete slideOptions.complete;
              $('#search-form').slideToggle(slideOptions);
            };
            $('#login-form').slideUp(slideOptions);
          } else {
            $('#search-form').slideToggle(slideOptions);
          }
        }
      }
    };

    $scope.search = function() {
      $location.path('/search/'+$scope.name);
    };

  }]);

