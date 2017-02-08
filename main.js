config = require('./config');

var express = require('express');
var app = express();

var server = require('http').Server(app);

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.host);

var router = express.Router();
app.use(router);

require('./prototypes');
require('./routes/route.main.js')(router);

server.listen(config.port).on('listening', function(){
    console.log('Listening on port '+ config.port);
});