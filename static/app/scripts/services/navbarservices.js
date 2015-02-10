angular.module('weberApp')
.factory('FriendsNotific', function($http, Restangular, $alert, $timeout) {

		var FriendsNotific = function(user_obj) {

			this.user_obj = user_obj;
			this.user_obj.get({
				seed: Math.random()
			}).then(function(resposne){
			    this.user_obj = resposne
			}.bind(this));
		};

		FriendsNotific.prototype.getRequestedPeoples = function(people_ids){
		    this.people_ids = people_ids;
		    this.peopledata = null;
		    var params = '{"_id": {"$in":"'+this.people_ids+'}}';
		    return Restangular.all('people').getList({
		     where : params
		    }).then(function(resposne){
		        this.peopledata = resposne
		    }.bind(this));
		};

		return FriendsNotific;
})
