angular.module('weberApp')
.factory('friendsActivity', function($http, Restangular, $alert, $timeout,CurrentUser) {

        var friendsActivity = function(currentuser, profileuser){
            this.currentuser = currentuser;
            this.profileuser = profileuser;
            this.status = '';

            if (typeof this.profileuser.notifications === "undefined"){
                profileuser.patch({
                    "notifications": []
                })
            }
            console.log(CurrentUser.user)
            if(typeof currentuser.user.notifications === "undefined"){
                currentuser.user.patch({
                    "notifications": []
                })
            }
        }

        friendsActivity.prototype.getRelation = function(){

			    if(this.profileuser.friends.indexOf(JSON.parse(this.currentuser.userId)) > -1){
                    this.status = 'unfriend';
                    return this.status;
                }

                if(this.status == ''){
                    var k = '';
                    for (k in this.profileuser.notifications){
                        if(this.profileuser.notifications[k].friend_requests == JSON.parse(this.currentuser.user.userId)){
                            this.status = 'cancel_sent'
                        return this.status
                        }
                    }
                }

                if(this.status == ''){
                    var k = ''
                    for (k in this.currentuser.user.notifications){
                        if(this.currentuser.user.notifications[k].friend_requests == JSON.parse(this.profileuser._id)){
                            this.status = 'reject_accept'
                        return this.status
                        }
                    }
                }

                if(this.status == ''){
                    this.status = 'addfriend'
                    return this.status
                }
        }
        return friendsActivity
	});