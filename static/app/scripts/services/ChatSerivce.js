angular.module('weberApp')
    .factory('ChatActivity', function($http, Restangular) {

        var ChatActivity = function(currentuser){

            this.currentuser = currentuser;
            this.chatfriends = null;

        }

        ChatActivity.prototype.getChatFriends = function(){

        if (this.currentuser.friends.length !== 0) {
            var params = '{"_id": {"$in":["'+(this.currentuser.friends).join('", "') + '"'+']}}';
            var data = Restangular.all('people').getList({where :params});
            return data;
		}
        };

    return ChatActivity;
    });
