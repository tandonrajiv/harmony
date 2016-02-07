/* Modules */

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var colors = require('colors');

var app = express();

// Middleware

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  //Auth Each API Request created by user. 
  next();
});

app.use(cookieParser());
app.use(bodyParser.raw({
  limit: 10000000000
}));

app.use(bodyParser.json({
  type: 'application/vnd.api+json',
  limit: 10000000
}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'easybill',
  resave: false,
  saveUninitialized: true
}));

// view engine setup
//app.set('views', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');
//app.use(logger('dev'));
app.use(function(req, res, next) {

  // log each request to the console
  if (req.method === "GET") {
    console.log(colors.green(req.method), req.url);
  } else {
    console.log(colors.yellow(req.method), req.url);
  }

  // continue doing what we were doing and go to the route
  next();
});

app.use('/', function(req, res) {
  return res.sendFile(__dirname + '/public/app.html');
});
console.log('server started');
// require('./app/routes')(app);
// pass our application into our routes

module.exports = app;
