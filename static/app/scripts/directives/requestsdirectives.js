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
            console.log("sdfsdf")
            element.click(function(){
               console.log('sdfsd')
               var html ='<cancelrequest><button ng-click="AddFriend()" class="btn btn-primary">AddFriend</button></cancelrequest>';
               var e =$compile(html)(scope);
               element.replaceWith(e);
            });

        }
    };
});