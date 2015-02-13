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
        controller:function ($scope, $auth, CurrentUser1,$http,$window,
        $document, Restangular,ChatActivity) {
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

                       $scope.send_message = function(receiverid){
                           var text = document.getElementById('send_'+receiverid).value;
                           document.getElementById('send_'+receiverid).value = null;
                           var temp = chatactivity.sendMessage(receiverid,text);
                           console.log(temp)
                       }
                        //========save open div=======

                        var getValue = function(){
                            return $window.sessionStorage.length;
                        }

                        var getData = function(){
                          var json = [];
                          $.each($window.sessionStorage, function(i, v){
                            json.push(angular.fromJson(v));
                          });
                          return json;
                        }

                        //$scope.images = getData();
                        //$scope.count = getValue();

                        $scope.getSpecificDiv = function(id){
                            var all_divs = getData();
                            var required_div = {};
                            for(div in all_divs){
                                if(all_divs[div].id === 'chatdiv_'+id){
                                    required_div = all_divs[div];
                                }
                            }
                            return required_div;
                        }

                        $scope.newchatdiv = function(id){

                            json = {
                              id: 'chatdiv_'+id,
                              minimize:false,
                              maximize:true,
                              right:0
                            }

                            $window.sessionStorage.setItem(id, JSON.stringify(json));
                            //$scope.count = getValue();
                            //$scope.images = getData();
                            console.log(getData())
                        }

                        $scope.deletechatdiv = function(id){
                          $window.sessionStorage.removeItem('chatdiv_'+id);
                          //$scope.count = getValue();
                          //$scope.images = getData();
                          alert('Removed with Success!');
                        }



                        display_divs();
                       //=========appending preivous divs
                        function display_divs(){
                           var previous_divs = getData();
                           var count = 320;
                           for(k in previous_divs){

                                previous_divs[k].right = count;
                                 count = count+300;

                           }
                           count = 300;
                           $scope.previousdivs = previous_divs;
                        }


                    });
            });

	    }
    }
}).directive("addchatdiv", function($compile){
	return function(scope, element, attrs){

		element.bind("click", function(){
		     scope.newchatdiv(element[0].id);
		     scope.getSpecificDiv(element[0].id)
             /*angular.element(document.getElementById('chat_divs')).append($compile(
                                    "<div id='chat_"+element[0].id+"'>"+
                                        "<textarea ng-model='text_"+element[0].id+"'></textarea><br/>"+
                                        "<input type='text' id='send_"+element[0].id+"'>"+
                                        '<input type="button" value="send" ng-click=send_message("'+element[0].id+'")>'+
                                    "</div>")(scope));*/

		});
	};
});