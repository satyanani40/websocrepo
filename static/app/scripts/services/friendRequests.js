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

        friendsActivity.prototype.unfriend = function(){

            var k = null;

                for (k in this.profileuser.friends){

                    if(this.profileuser.friends[k] == (this.currentuser._id)){
                        this.profileuser.friends.splice(this.profileuser.friends.indexOf(this.currentuser._id),1)
                        this.profileuser.patch({
                           'friends': this.profileuser.friends
                        }).then(function(response){
                            console.log("deleted at profile friend")
                            console.log(response)


                        })

                    }
                }

            k = null;

            for(k in this.currentuser.friends){
                if(this.currentuser.friends[k] ==(this.profileuser._id)){
                    this.currentuser.friends.splice(this.currentuser.friends.indexOf(this.profileuser._id),1);
                    this.currentuser.patch({
                        'friends': this.currentuser.friends
                    }).then(function(response){
                        console.log("deleted at current friend")
                        console.log(response)


                    });
                }
            }
        }

        friendsActivity.prototype.reject_request = function(){
            var k = null;
            var data = null;
                for (k in this.currentuser.notifications){
                    if(this.currentuser.notifications[k].friend_id == (this.profileuser._id)){
                        this.currentuser.notifications.splice(this.currentuser.notifications.indexOf(this.profileuser._id),1)
                        data = this.currentuser.patch({
                           'notifications': this.currentuser.notifications
                        });

                    }
                }
            return data;

        }



        friendsActivity.prototype.accept_request = function(){

            var k = null;
            var self = this;

            if(this.profileuser.friends.indexOf(this.currentuser._id) == -1){
                this.profileuser.friends.push(this.currentuser._id)
                this.profileuser.patch({
                   'friends': this.profileuser.friends
                }).then(function(response){

                    var new_request = {'accepted_id':this.currentuser._id,'seen':false}

                    self.profileuser.notifications.push(new_request);

                    Restangular.one('people',self.profileuser._id).patch({
                        'notifications':self.profileuser.notifications
                    },{},{'If-Match':response._etag});




                     k = null;

                    console.log("=======previous etag current user ------------")
                    console.log(self.currentuser._etag)

                    if(self.currentuser.friends.indexOf(self.profileuser._id) == -1){


                        self.currentuser.friends.push(self.profileuser._id)

                        //this.currentuser._etag = response._etag;

                        self.currentuser.patch({
                            'friends': self.currentuser.friends
                        }).then(function(response){
                            console.log("added to current user")
                            console.log(response)

                            k = null;

                            self.currentuser._etag = response._etag;

                            for (k in self.currentuser.notifications){
                                    if(self.currentuser.notifications[k].friend_id == (self.profileuser._id)){
                                        self.currentuser.notifications.splice(self.currentuser.notifications.indexOf(self.profileuser._id),1)
                                        console.log("===================current user notifications===========")
                                        console.log(self.currentuser._etag)
                                        data = Restangular.one('people',self.currentuser._id).patch({
                                           'notifications': self.currentuser.notifications
                                        },{},{'If-Match':response._etag});

                                    }
                            }


                        });
                    }

                    console.log("added to profile user")
                    console.log(response)


                })
            }



             /**/
        }

         return friendsActivity
	});