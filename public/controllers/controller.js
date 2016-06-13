
// Including angular and other modules
var myApp = angular.module('myModule',['tc.chartjs','ngRoute','angularUtils.directives.dirPagination','ngSanitize','ngAnimate']);



// Configuring our routes
myApp.config(['$routeProvider',function($routeProvider) {
  $routeProvider

    // route for home page and root page --> both have same pages i.e home.html
    .when('/',{
      templateUrl : 'pages/home.html',
      controller : 'mainController'
    })
    
    .when('/home',{
      templateUrl : 'pages/home.html',
      controller : 'mainController'
    })

    // route for Charts page
    .when('/charts', {
      templateUrl : 'pages/charts.html',
      controller : 'chartController'
    })

    // route for Automation results page
    .when('/results', {
      templateUrl : 'pages/results.html',
      controller : 'resultController'
    })

    // route for Bugs per cycle page
    .when('/bugList', {
      templateUrl : 'pages/bugList.html',
      controller : 'bugList'
    })
}]);

// Create the controllers and inject Angular's $scope

// Home page controller
myApp.controller('mainController', ['$scope',function($scope){
  
  $scope.message = 'Landing Page';

  //Animation class name
  $scope.pageClass = 'page-home';

}]);

// Global variable for chart options using value()
myApp.value('myChartOps',{

    // Sets the chart to be responsive
    responsive: true,

    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : false,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether the line is curved between points
    bezierCurve : true,

    //Number - Tension of the bezier curve between points
    bezierCurveTension : 0.4,

    //Boolean - Whether to show a dot for each point
    pointDot : true,

    //Number - Radius of each point dot in pixels
    pointDotRadius : 4,

    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth : 1,

    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 20,

    //Boolean - Whether to show a stroke for datasets
    datasetStroke : true,

    //Number - Pixel width of dataset stroke
    datasetStrokeWidth : 2,

    //Boolean - Whether to fill the dataset with a colour
    datasetFill : true,

    // Function - on animation progress
    onAnimationProgress: function(){},

    // Function - on animation complete
    onAnimationComplete: function(){},

    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke : true,

    //String - The colour of each segment stroke
    segmentStrokeColor : '#fff',

    //Number - The width of each segment stroke
    segmentStrokeWidth : 2,

    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout : 50, // This is 0 for Pie charts

    //Number - Amount of animation steps
    animationSteps : 100,

    //String - Animation easing effect
    animationEasing : 'easeOutBounce',

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate : true,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale : false,


    //Boolean - Show a backdrop to the scale label
    scaleShowLabelBackdrop : true,

    //String - The colour of the label backdrop
    scaleBackdropColor : 'rgba(255,255,255,0.75)',

    // Boolean - Whether the scale should begin at zero
    scaleBeginAtZero : true,

    //Number - The backdrop padding above & below the label in pixels
    scaleBackdropPaddingY : 2,

    //Number - The backdrop padding to the side of the label in pixels
    scaleBackdropPaddingX : 2,

    //Boolean - Show line for each value in the scale
    scaleShowLine : true,

    //Boolean - Stroke a line around each segment in the chart
    segmentShowStroke : true,

    //String - The colour of the stroke on each segement.
    segmentStrokeColor : '#fff',

    //Number - The width of the stroke value in pixels
    segmentStrokeWidth : 2,

    
  });


// Charts controller
myApp.controller('chartController', ['$scope', '$http','myChartOps', function($scope, $http,myChartOps){
      
      //Animation class name
  $scope.pageClass = 'page-charts';


      // Data for line chart
      //Through REST api getting the data for specific fields from server.js
 	//Get the callback and then put the data in line chart fields

	$http.get('/lineChartRoute').success(function(response){
	  console.log("I got the data for line chart i requested:", response);
	  
    $scope.labels = response[1]; //For line chart labels
	  $scope.data = response[0]; // for line charts data
	  console.log("--->",$scope.labels);
	  console.log("***:", $scope.data);
	  	
	  	// Declaring the below inside call back i.e $http.get so that it gets the data when the call back event is initialized
	  	//If we declare the below in seperate function outside our current call back will return the control and the function defined outside
	  	//will get no data
		$scope.lineChartData = {
		    //labels: $scope.labels.labels, // Getting the labels object from $scope.labels
		    
        labels: $scope.labels,
        datasets: [
		      {
		        fillColor: 'rgba(220,220,220,0.2)',
		        strokeColor: 'rgba(220,220,220,1)',
		        pointColor: 'rgba(220,220,220,1)',
		        pointStrokeColor: '#fff',
		        pointHighlightFill: '#fff',
		        pointHighlightStroke: 'rgba(220,220,220,1)',
		        data: $scope.data //Getting data object from $scope.data
		      }
		     
		    ]
		  };

	  });


	  // Data for Doughnut and Pie chart
  	//Getting the data from mongodb with the below REST api
  	$http.get('/pieChartRoute').success(function(response){
  	console.log("I got the data for pie chart i requested:", response);
  	$scope.pieChartData = response;
  
  	});

   

  // Chart.js Options
  $scope.options =  myChartOps

}]);


// Controller for getting test results mongo data
myApp.controller('resultController', ['$scope', '$http', function($scope,$http){

 //Animation class name
  $scope.pageClass = 'page-results'; 

  //console.log(myChartOps);

// with the below route angular will contact server.js to get the data from mongodb 
  $http.get('/testlist').success(function(response){
    console.log("I got the data i requested for test results", response);
    $scope.testlist = response; //It will put the data into html file , response is what we got from the api that is being there in the server.js
    
    //Function for sorting
    $scope.sort = function(keyname){
      $scope.sortKey = keyname; // Set the sortkey to the param passed
      $scope.reverse = !$scope.reverse; // if true make it false and vice versa
    }

  });

}]);


// Controller for adding Bugs per cycle
myApp.controller('bugList',['$scope', '$http', '$interpolate','$timeout',function($scope,$http,$interpolate,$timeout){
  
  //Animation class name
  $scope.pageClass = 'page-bugList';


  // Initializing alert as empty
  $scope.alert = "" ; 
  $scope.delAlert = "" ;
  
    // Putting the get buglist data under refresh function
    var refresh = function() {

    	// with the below route angular will contact server.js to get and post bug's data in mongodb 
    	$http.get('/bugListRoute').success(function(response){

    	  console.log("I got the data i requested for Bugs", response);

    	  $scope.bugListData= response; //It will put the data into html file , response is what we got from the api that is there in the server.js
    	  $scope.buglist= ""; // It will empty the input box after adding the data	
         
    	});

    };

    refresh();


    // Function to add bug list 
    $scope.addBug = function(){
    	console.log("Bug list data ======>",$scope.buglist)
    	// Getting the response for our post request. Here response is the argument from the server
    	$http.post('/bugListRoute', $scope.buglist).success(function(response){
    		console.log("added Bug =======>",response);
        
        // sending an alert once we get post req --> response after adding bug
          if (response){
            console.log("sending html",response);
            $scope.alert = "Bug added Successfully";
            console.log("before 2 secs ======>",$scope.alert);
            
            // using interpolate to return html as text to the bugList html page
            // Sending bootstrap success alert 
            //$scope.html = $interpolate('<div class = "alert alert-success" role="alert">{{alert}}</div>')($scope);
            
            refresh();

            //Adding a 2 second delay and emptying the alert
             $timeout(function(){
               $scope.alert = ""; 
               console.log("after 2 secs ======>",$scope.alert);
               
              },2000);
            
        }
    		       
    	});
    };


    // Function to delete a Bug entry from the UI
    $scope.remove = function(id) {
    	console.log(id); //id of the entry we want to delete
      $http.delete('/bugListRoute/' + id).success(function(response){
        if (response){
            console.log("sending html",response);
            $scope.delAlert = "Bug deleted Successfully";
            console.log("before 2 secs ======>",$scope.delAlert);


        refresh(); //To immediately refresh the page after deleting the entry
        
        //Adding a 2 second delay and emptying the alert
             $timeout(function(){
               $scope.delAlert = ""; 
               console.log("after 2 secs ======>",$scope.delAlert);
               
              },2000);

           }

      });

    };

}]);

