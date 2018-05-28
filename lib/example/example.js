'use strict';

angular.module('myApp.example', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/example', {
    templateUrl: 'example/example.html',
    controller: 'ExampleCtrl'
  });
}])

.controller('ExampleCtrl', ['$rootScope','$auth','$conduit','$iglue',function($rootScope,$auth,$conduit,$iglue) {

    $auth.login('admin','stud1O4465');

    $rootScope.$on('event:auth-loginConfirmed', function(event,data) {
        $iglue.app().version(function(data){
            console.log(data.version);
        });
        $iglue.app().settings(function(data){
            console.log(data);
        });

        $iglue.user().account(function(data){
            console.log(data);
        });

        $iglue.user().get(function(data){
            console.log(data);
        });

        $conduit.collection("doc").get().then(function(data){
            console.log(data);
            $auth.logout();
        });
    });



}]);