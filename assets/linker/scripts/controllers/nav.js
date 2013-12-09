'use strict';

angular.module('n.otifi.coApp')
  .controller('NavCtrl', function ($scope, $location) {

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

  });

