var ang = angular.module('myApp', ['usersnapLogging']);

ang.config(function($logProvider,mySProvider){
debugger;
    var mySRef = mySProvider.$get();
        $logProvider.debugEnabled(false);
});
ang.service('myS',function(){

    this.serviceCall= function(){
        debugger;
    }
})


ang.controller("myHome", function ($scope, $log) {

    $scope.errorMe = function () {
        $scope.userId = "naved971" + aa;

    }



    $scope.showLog = function () {
        $log.error();
    }

})