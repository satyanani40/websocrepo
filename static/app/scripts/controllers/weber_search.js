'use strict';

/**
 * @ngdoc function
 * @name weberApp.controller:WeberSearchCtrl
 * @description
 * # WeberSearchCtrl
 * Controller of the weberApp
 */
angular.module('weberApp')
	.controller('WeberSearchCtrl', function($scope, $auth, Restangular, InfinitePosts, $alert, $http, CurrentUser, UserService,SearchActivity) {
		$scope.UserService = UserService;

		$http.get('/api/me', {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': $auth.getToken()
			}
		}).success(function(user_id) {
			Restangular.one('people',JSON.parse(user_id)).get().then(function(user) {
				$scope.user = user;
				$scope.searchActivity = new SearchActivity(user);


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

			var params = '{"$or":[{"name.first":{"$regex":".*'+$scope.search+'.*"}},{"name.last":{"$regex":".*'+$scope.search+'.*"}},{"username":{"$regex":".*'+$scope.search+'.*"}}]}';
 			Restangular.all('people').getList({where :params}).then(function(data) {
        		$scope.totalNames = data.length;
				$scope.searchNames = data;

        	});

			if(CurrentUser.userId != undefined){
				$scope.searchActivity.addSearchText($scope.search);
			}
        };
	});