angular.module('weberApp')
.directive('cancelrequest', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            console.log("sdfsdf")
            element.click(function(){
               console.log('sdfsd')
               var html ='<addfriend><button ng-click="cancelrequest()" class="btn btn-primary">cancel request</button></addfriend>';
               var e =$compile(html)(scope);
               element.replaceWith(e);
            });

        }
    };
}).directive('addfriend', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {

            element.click(function(){
               var html ='<cancelrequest><button ng-click="AddFriend()" class="btn btn-primary">AddFriend</button></cancelrequest>';
               var e =$compile(html)(scope);
               element.replaceWith(e);
            });

        }
    };
}).directive('friends', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            element.click(function(){
               var html ='<b>friends</b>';
               var e =$compile(html)(scope);
               element.replaceWith(e);
            });

        }
    };
}).directive('unfriend', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            element.click(function(){
               var html ='<addfriend><button ng-click="unfriend()" class="btn btn-primary">unfriend</button></addfriend>';
               var e =$compile(html)(scope);
               element.replaceWith(e);
            });

        }
    };
})
.directive('chatbar', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        templateUrl: "/static/app/views/chat.html",
        controller:function ($scope, $auth, CurrentUser1,$http,Restangular,ChatActivity) {
            $http.get('/api/me', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
            }).success(function(userId) {
                    this.userId = userId;
                    Restangular.one('people', JSON.parse(userId)).get().then(function(user) {
                        this.user = user;
                        var chatactivity = new ChatActivity(user);

                        chatactivity.getChatFriends().then(function(data){
                            console.log(data)
                            $scope.chatusers = data;
                        });

                        /*chatactivity.getChatFriends.then(function(response){
                            $scope.chatusers = response;
                            console.log("=======caht======")
                            console.log($scope.chatusers)
                        });*/
                    });
            });

	    }
    }
}).directive("addchatdiv", function($compile){
	return function(scope, element, attrs){

		element.bind("click", function(){
		     console.log(element[0].id)
             angular.element(document.getElementById('chat_divs')).append($compile(
                                    "<div id='chat_"+element[0].id+"'>"+
                                        "<textarea id='text_"+element[0].id+"'></textarea><br/>"+
                                        "<input type='text' id='send_"+element[0].id+"'>"+
                                    "</div>")(scope));

		});
	};
});