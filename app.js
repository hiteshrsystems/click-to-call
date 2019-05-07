var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');

var expressSession = require('express-session');
var app = express();


/* CREATE MULTIPLE CONNECTION IN ASTERISK TO MANAGE CONFERENCE CALL */

// Asterisk Connection 1 For Conference bridge
const asteriskCred = config.ASTERISK_CONNECTION;
global.ami = new require('asterisk-manager')(asteriskCred.port,asteriskCred.IP,asteriskCred.username,asteriskCred.passwd, true);
ami.keepConnected();




// Database Connection
var mongoose = require('mongoose');
mongoose.connect(config.MONGODB_CONNECT);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Database connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('superSecret', "rsystem");

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, x-access-token, Content-Type, Accept");
	if ('OPTIONS' == req.method) {
		res.json({"success":true});
	}
	else {
		next();
	}
});

// TO HANDLE ASTERISK EVENT FOR CONNECTION
ami.on('managerevent', function(evt) {
	let events = require('./controller/eventController.js');
	eventsObj = new events(evt);
	if (typeof evt['event'] != "undefined" && evt['event'] == "DialEnd" && typeof evt['dialstatus'] != "undefined" && evt['dialstatus'] == "ANSWER"){
		if(evt['destuniqueid'] == evt['destlinkedid']){
			eventsObj.callDestination();
		}
	}
});
//END OF CODE TO HANDLE ASTERISK EVENT FOR CONNECTION

require('./routes/calls')(app, express);
module.exports = app;

