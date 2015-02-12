'use strict';

/**
 * @ngdoc function
 * @name weberApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the weberApp
 */
angular.module('weberApp')
	.controller('SettingsCtrl', function($route, $scope, $auth, Restangular, InfinitePosts, $alert, $http, CurrentUser, UserService) {
		$scope.UserService = UserService;
		$http.get('/api/me', {
			headers: {
				'Content-Type': 'application/json',
                'Authorization':$auth.getToken()
			}
		}).success(function(user_id) {
			var passReq = Restangular.one("people", JSON.parse(user_id)).get().then(function(result) {
              $scope.user = result;
            });
            $scope.updateUsername = function() {
                $scope.user.patch({
                    'username':$scope.u_username
                }).then(function(response){
                    $route.reload();
                })
			};

			$scope.updateEmail = function() {
                $scope.user.patch({
                    'email':$scope.u_email
                }).then(function(response){
                    $route.reload();
                })
			};

			$scope.updatePassword = function() {
                $scope.user.patch({
                    'password_test':$scope.u_password
                }).then(function(response){
                    $route.reload();
                })
			};

		});
	});