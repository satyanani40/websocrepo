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
	 										SearchActivity, MatchMeResults) {
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


		$scope.searching = function(){



        	function combine_ids(ids) {
   				return (ids.length ? "\"" + ids.join("\",\"") + "\"" : "");
			}

			var matchResults = new MatchMeResults();
			var params1 = '{"$or":[{"keywords": {"$in":['+(combine_ids($scope.search.split(" ")))+']}},{"content":{"$regex":".*'+$scope.search+'.*"}}]}';
			var params2 = '{"author":1}';
			matchResults.getMatchResults($scope.search,combine_ids($scope.search.split(" "))).then(function() {
					$scope.matchmeresults = matchResults;

       				 if(CurrentUser.userId != 'undefined'){
						$scope.searchActivity.addSearchText($scope.search,matchResults.total_matches,matchResults.matchedids,$scope.search.split(" "));
					}
   			});

			matchResults.getMatchPeoples($scope.search).then(function() {
					$scope.matchmeresults = matchResults;
					console.log($scope.matchmeresults)

			});
        };

		$scope.loadNewResullts = function(searchId){
			var matchResults = new MatchMeResults();
			matchResults.getMatchedNewResults(searchId).then(function() {
					console.log(matchResults)
					$scope.matchmeresults = matchResults;
					//console.log($scope.matchmeresults)

			});

		};

	}).directive('myDirective', function(){
    	return function(scope, element, attr){
		console.log(attr)
        element.bind('click', function(){
        	scope.loadNewResullts(element[0].id);

        });
    };
});