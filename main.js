config = require('./config');

var express = require('express');
var app = express();

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.host);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Set up sessions in express
/*
 var session = require('express-session');
 var sessionMiddleware = session({
 secret: config.secret,
 resave: false,
 saveUninitialized: true
 });
 app.use(sessionMiddleware);
 */

var flash = require('express-flash');
app.use(flash());

//Initialize passport for local login
/*
 var passport = require('passport');
 app.use(passport.initialize());
 app.use(passport.session());
 require('./auth/control.local.js')(passport);
 */

//Initialize passport for jwt login
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require("./auth/control.jwt")(passport);

var router = express.Router();
app.use(router);

require('./prototypes');
require('./routes/route.main')(router);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

require('./sockets/socket.main')(io);

server.listen(config.port).on('listening', function(){
    console.log('Listening on port '+config.port)
});