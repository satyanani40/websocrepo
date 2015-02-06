'use strict';

/**
 * @ngdoc function
 * @name weberApp.controller:UserprofileCtrl
 * @description
 * # UserprofileCtrl
 * Controller of the weberApp
 */
angular.module('weberApp')
	.controller('UserprofileCtrl', function($scope, $routeParams,
	                                        Restangular, InfinitePosts, UserService,
	                                        CurrentUser, FriendsNotific) {

		$scope.UserService = UserService;

		var cuser =  new CurrentUser();

        cuser.getCurrentUser().then(function(){
            $scope.currentuser = cuser;
            console.log($scope.currentuser)
        });




		/*cuser.getCurrentUser().then(function(){
             $scope.testing = cuser;
             console.log(cuser)
        })*/

        /*var user_obj = Restangular.one('people', $routeParams.username);
		user_obj.get().then(function(user) {


			$scope.user = user;
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
		});*/


	});


