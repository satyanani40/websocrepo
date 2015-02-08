angular.module('weberApp')
.factory('friendsActivity', function($http, Restangular, $alert, $timeout,CurrentUser) {

        var friendsActivity = function(currentuser, profileuser){
            //console.log(profileuser)
            this.currentuser = currentuser;

            this.profileuser = profileuser;

            this.status = null;
            this.status_method = null;

            if (typeof this.profileuser.notifications === "undefined"){
                profileuser.patch({
                    "notifications": []
                })
            }

            if(typeof this.currentuser.notifications === "undefined"){
                currentuser.patch({
                    "notifications": []
                })
            }

        }

        friendsActivity.prototype.getRelation = function(){

                //console.log(this.profileuser.friends)
			    //console.log(this.currentuser._id)


                if(this.status === null){

                    if(this.profileuser.friends.indexOf(this.currentuser._id) > -1){

                        this.status = 'unfriend';

                    }
                }

                if(this.status === null){
                    var k = '';
                    for (k in this.profileuser.notifications){
                        if(this.profileuser.notifications[k].friend_id == (this.currentuser._id)){
                            this.status = 'cancelrequest';
                        }
                    }
                }

                if(this.status === null){
                    var k = ''
                    for (k in this.currentuser.notifications){
                        if(this.currentuser.notifications[k].friend_id == (this.profileuser._id)){
                            this.status = 'reject_accept';
                        }
                    }
                }

                if(this.status === null){
                    this.status = 'addfriend'
                }
            return (this.status)
        }

        friendsActivity.prototype.AddFriend = function(){

            var new_request = {'friend_id':this.currentuser._id,'seen':false}

            this.profileuser.notifications.push(new_request);

            var data = this.profileuser.patch({
                'notifications':this.profileuser.notifications
            });
            return data;

        }

        friendsActivity.prototype.cancelrequest = function(){
            var k = null;
            var data = null;
                for (k in this.profileuser.notifications){
                    if(this.profileuser.notifications[k].friend_id == (this.currentuser._id)){
                        this.profileuser.notifications.splice(this.profileuser.notifications.indexOf(this.currentuser._id),1)
                        data = this.profileuser.patch({
                           'notifications': this.profileuser.notifications
                        });

                    }
                }
            return data;



        }

        return friendsActivity
	});