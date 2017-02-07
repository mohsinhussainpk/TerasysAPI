config = require('./config');

var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.host);

var router = express.Router();
app.use(router);

require('./routes/route.main.js')(router);

require('./prototypes');
require('./socketio/socket.main')(io);

server.listen(config.port).on('listening', function(){
    console.log('Listening on port '+ config.port);
});