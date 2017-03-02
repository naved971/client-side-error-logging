var ang = angular.module('myApp', ['xavientClientSideLogging']);

ang.config(function ($logProvider, mySProvider) {
    var mySRef = mySProvider.$get();
    $logProvider.registerEnabled(true,mySRef.serviceCall);


    // $logProvider.debugEnabled(false);
});
ang.service('myS', function () {

    this.serviceCall = function (error) {
        console.log(error,'bilal')

    }
})


ang.controller("myHome", function ($scope, $log) {

    $scope.errorMe = function () {
        $scope.userId = "naved971" + aa;

    }

 $log.error();

    $scope.showLog = function () {

    }

})