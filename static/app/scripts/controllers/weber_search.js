'use strict';

/**
 * @ngdoc function
 * @name weberApp.controller:WeberSearchCtrl
 * @description
 * # WeberSearchCtrl
 * Controller of the weberApp
 */
angular.module('weberApp')
	.controller('WeberSearchCtrl', function($scope, $auth, Restangular, InfinitePosts, $alert, $http, CurrentUser, UserService) {
		$scope.UserService = UserService;

		$http.get('/api/me', {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': $auth.getToken()
			}
		}).success(function(user_id) {
			Restangular.one('people',JSON.parse(user_id)).get().then(function(user) {
				$scope.user = user;
				$scope.infinitePosts = new InfinitePosts(user);
			});
		});



        $scope.searching = function(){

        	function combine_ids(ids) {
   				return (ids.length ? "\"" + ids.join("\",\"") + "\"" : "");
			}

			var params = '{"keywords": {"$in":['+(combine_ids($scope.search.split(" ")))+']}}';
 			var params2 = '{"author":1}';

        	Restangular.all('people/posts').getList({where :params,embedded :params2}).then(function(data) {
        		$scope.total_matches = data.length;
				$scope.searchresults = data;
        	});

			
        };
	});