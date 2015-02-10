angular.module('weberApp')
.factory('FriendsNotific', function($http, Restangular, $alert, $timeout) {

		var FriendsNotific = function(user_obj) {

			this.user_obj = user_obj;
			return this.user_obj.get({
				seed: Math.random()
			});
		};


		return FriendsNotific;
})
