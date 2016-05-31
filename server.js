// Modules required

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');


//Body Parser 
var bodyParser = require('body-parser');

//Below code tells that we need the mongojs module
var mongojs = require('mongojs');

//Init app
var app = express();

//Below code tells that we are initializing a db variable and first entry is the db name and second is the collection 
//var db = mongojs('testlist',['testlist']);

var db = mongojs('testlist');

var mycoll = db.collection('testlist'); //collection for test results
var linecoll = db.collection('linecoll'); //collection for linechart data
var piecoll = db.collection('piecoll'); // collection for pie chart
var buglist = db.collection('buglist'); //Collection for bugs per cycle

// View Engine
app.set('views', path.join(__dirname, 'views'));
//app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'ejs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);

// Serve all files under public


//body parser to json
app.use(bodyParser.json());



// '/testlist' is the route of angular that going to interact with angularjs when 
//controller of angular will contact server.js and in turn the function written for the route will contact mongodb to fetch the data
// api returns the data in json format which will be formatted by angular controller
app.get('/testlist', function(req,res){
	console.log("I received a GET request for test results")

	mycoll.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});



/*api for fetching linechart data from mongo and returning linechart data to angular
app.get('/lineChartRoute', function(req,res){
	console.log("I received a GET request for line chart data")

	linecoll.find({},{"labels":1,"_id":0,"data":1, "_id":0},function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});
*/

//api for fetching linechart data from buglist collection and returning linechart data to angular
app.get('/lineChartRoute', function(req,res){
	console.log("I received a GET request for line chart data")

	//aggregate to push the data to arrays
	buglist.aggregate({$group:{ _id: null,bugsArray : { $push :  "$bugs" },cycles : { $push : "$cycle" }}},function(err, docs){
		console.log("line chart data ======>",docs[0].bugsArray);
		console.log("line chart data ======>",docs[0].cycles);
		
		//storing the arrays to a collective array and send it to angular 
		var arr = [];
		arr[0]=docs[0].bugsArray;
		arr[1]=docs[0].cycles
		console.log("new array=====>>>",arr);
		res.send(arr);
		
	});
	
});


//api for fetching piechart data from mongo and returning piechart data to angular
app.get('/pieChartRoute', function(req,res){
	console.log("I received a GET request for pie and doughnut chart data")

	piecoll.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});


//api for fetching bug list data
app.get('/bugListRoute', function(req,res){
	console.log("I received a GET request for bug list")

	buglist.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});


//api getting post request from angular and after inserting the data it's sending back the data to the controller
app.post('/bugListRoute', function(req,res){
	console.log(req.body);
	// Inserting the data into MongoDB coll-----> buglist and  sending back the data to angular
	buglist.insert(req.body, function(err,doc){
		res.json(doc);
	});
});

// Api for deleting the data with specific id
app.delete('/bugListRoute/:id', function(req,res){
	var id = req.params.id;
	console.log(id); //Printing the id of the bug that we want to remove <--- getting the call from delete REST call from angular on same route
	// Here id is the variable in line 90
	buglist.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
		res.json(doc); //Sending back the doc (entry) that we are deleting to the controller
	});
});


app.listen(3000,'0.0.0.0');