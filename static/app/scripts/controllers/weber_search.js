'use strict';

/**
 * @ngdoc function
 * @name weberApp.controller:WeberSearchCtrl
 * @description
 * # WeberSearchCtrl
 * Controller of the weberApp
 */
angular.module('weberApp')
	.controller('WeberSearchCtrl', function($scope, $auth, Restangular,
	 										InfinitePosts, $alert, $http,
	 										CurrentUser, UserService,
	 										SearchActivity, matchMeResults) {
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
				var namespace = '/test';
				var source = new EventSource('/stream');
				source.onmessage = function (event) {
     				if(parseInt(event.data)){
     					console.log(event.data)
     					$scope.searchActivity = new SearchActivity(user);
     				}
  				};
			});
		});

		$scope.loadNewResullts = function(searchId){
			$scope.searchActivity.getMatchedNewResults(searchId);
		};

		$scope.searching = function(){

        	function combine_ids(ids) {
   				return (ids.length ? "\"" + ids.join("\",\"") + "\"" : "");
			}

			$scope.matchmeresults = new matchMeResults();
			console.log($scope.matchmeresults)
			/*function getSearchKarray(ids) {
   				return (ids.length ?  ids.join("\",\"")  : "");
			}*/

			var params = '{"$or":[{"keywords": {"$in":['+(combine_ids($scope.search.split(" ")))+']}},{"content":{"$regex":".*'+$scope.search+'.*"}}]}';
			var params2 = '{"author":1}';
        	Restangular.all('posts').getList({where :params,embedded :params2}).then(function(data) {
        		$scope.total_matches = data.length;
        		$scope.searchresults = data;
        		var i;
        		var resultIds = []
        		for(i=0;i<$scope.total_matches;i++){
        			resultIds.push($scope.searchresults[i]['_id'])
        		}
        		if(CurrentUser.userId != undefined){
        			$scope.searchActivity.addSearchText($scope.search,$scope.total_matches,resultIds,$scope.search.split(" "));
				}
        	});

			var params = '{"$or":[{"name.first":{"$regex":".*'+$scope.search+'.*"}},{"name.last":{"$regex":".*'+$scope.search+'.*"}},{"username":{"$regex":".*'+$scope.search+'.*"}}]}';
 			Restangular.all('people').getList({where :params}).then(function(data) {
        		$scope.totalNames = data.length;
				$scope.searchNames = data;

        	});


        };
	}).directive('myDirective', function(){
    	return function(scope, element, attr){
        element.bind('click', function(){
        	scope.loadNewResullts(element[0].id);
        });
    };
});