'use strict';

/**
 * @ngdoc function
 * @name weberApp.controller:UserprofileCtrl
 * @description
 * # UserprofileCtrl
 * Controller of the weberApp
 */
angular.module('weberApp')
	.controller('UserprofileCtrl', function($scope, $routeParams, Restangular,
											InfinitePosts, CurrentUser, UserService,FriendsNotific) {

		$scope.UserService = UserService;
		var user_obj = Restangular.one('people', $routeParams.username);

		user_obj.get().then(function(user) {
			$scope.user = user;

			$scope.unfriend = function() {

                if($scope.user.friends.indexOf($scope.user._id) != -1){
                    $scope.user.friends.splice($scope.user.friends.indexOf($scope.user._id), 1)
                    $scope.user.patch({
                        "friends":$scope.user.friends
                        })
                        .then(function(data){
                            //console.log(data)
                        });
                }
                if(CurrentUser.user.friends.indexOf($scope.user._id) != -1){
                    CurrentUser.user.friends.splice(CurrentUser.user.friends.indexOf($scope.user._id), 1)
                    CurrentUser.user.patch({
                        "friends":CurrentUser.user.friends
                    }).then(function(data){
                        //console.log(data)
                    });
                }
            }

            $scope.addfriend = function(){
                $scope.user.notifications.push({seen:0,friend_requests:CurrentUser.user._id})
                $scope.user.patch({
                        "notifications":$scope.user.notifications
                        })
                        .then(function(data){
                            console.log(data)
                        });
            }
            $scope.cancel_request = function(){

                var i
                for(i = 0; i<(($scope.user.notifications).length);i++){

                    if(($scope.user.notifications[i].friend_requests) == CurrentUser.user._id){
                        $scope.user.notifications.splice(i,1)
                        $scope.user.patch({
                            "notifications":$scope.user.notifications
                        })
                        .then(function(data){
                            console.log(data)
                        });

                    }
                }
            }

            $scope.reject_request = function(){
                var i
                for(i = 0; i<((CurrentUser.user.notifications).length);i++){

                    if((CurrentUser.user.notifications[i].friend_requests) == $scope.user._id){
                        CurrentUser.user.notifications.splice(i,1)
                        CurrentUser.user.patch({
                            "notifications":CurrentUser.user.notifications
                        })
                        .then(function(data){
                            console.log(data)
                        });

                    }
                }
            }
            $scope.accept_request = function(){

                CurrentUser.user.friends.push($scope.user._id)
                CurrentUser.user.patch({
                            "friends":CurrentUser.user.friends
                })
                .then(function(data){
                    console.log(data)
                });

                $scope.user.friends.push(CurrentUser.user._id)
                $scope.user.patch({
                    "friends": $scope.user.friends
                })
                .then(function(data){
                    console.log(data)
                });

            }



			$scope.check_relation = function(){

    		    status = '';
			    if($scope.user.friends.indexOf(JSON.parse(CurrentUser.userId)) > -1){
                    status = 'unfriend';
                    return status;
                }

                if(status == ''){
                    var k = ''
                    for (k in $scope.user.notifications){
                        if($scope.user.notifications[k].friend_requests == JSON.parse(CurrentUser.userId)){
                        status = 'cancel_sent'
                        return status
                        }
                    }
                }

                if(status == ''){
                    var k = ''
                    for (k in CurrentUser.user.notifications){
                        if(CurrentUser.user.notifications[k].friend_requests == JSON.parse($scope.user._id)){
                            status = 'reject_accept'
                        return status
                        }
                    }
                }

                if(status == ''){
                    status = 'addfriend'
                    return status
                }
            }



		$scope.infinitePosts = new InfinitePosts(user_obj);
			//get all friends
			if (user.friends.length !== 0) {
				Restangular.all('people').getList({
					where: {
						"_id": {
							"$in": $scope.user.friends
						}
					}
				}).then(function(friends) {
					$scope.friends = friends;
				});
			}
		});


	});