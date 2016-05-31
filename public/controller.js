// Including ngRoute and tc.chartjs modules
var myApp = angular.module('myModule',['ngRoute'],['tc.chartjs']);

// Configuring our routes
myApp.config(['$routeProvider',function($routeProvider) {
  $routeProvider

    // route for home page
    .when('/',{
      templateUrl : '/home.html',
      controller : 'mainController'
    })

    // route for Charts page
    .when('/charts', {
      templateUrl : '/charts.html'
    })
}]);

// Create the controllers and inject Angular's $scope

myApp.controller('mainController', ['$scope',function($scope){
  
  $scope.message = 'Everyone';

}]);