'use strict';

/**
 * @ngdoc function
 * @name weberApp.controller:InstantsearchCtrl
 * @description
 * # InstantsearchCtrl
 * Controller of the weberApp
 */
angular.module('weberApp')
  .controller('InstantsearchCtrl', function ($scope, $routeParams, $location) {
      $scope.searchSubmit = function(){
					$location.path("/search").search({q: $scope.search});
			};
    
  });

