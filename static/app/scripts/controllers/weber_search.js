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




		$scope.getSuggestions = function(){
			console.log($scope.search)

		}

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
         $scope.getSuggestions = function(){
		 Restangular.all('people/searchActivity').getList().then(function(data) {
            $scope.rslts = data
            if($scope.search == ""){
                $scope.rslts = ""
            }
         });
         }

        $scope.searching = function(){

			   console.log(CurrentUser.userId)
			   var params = '{"keywords": {"$in":["'+($scope.search.split(" "))+'"]}}'
               console.log(params)
               Restangular.all('people/posts').getList({where :params}).then(function(data) {
                                    $scope.results = data
               });
			if(CurrentUser.userId != undefined){
				   Restangular.all('people').all('searchActivity').post({
			   	content:  $scope.search,
				author : JSON.parse(CurrentUser.userId),

			});
			   $scope.search = ""
			}else{
				   Restangular.all('people').all('searchActivity').post({
			   	content:  $scope.search,
				});
			   $scope.search = ""
			}

        };
	});