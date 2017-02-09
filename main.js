config = require('./config');

const https = require('https');
const fs = require('fs');

var certificate = fs.readFileSync( './keys/terasyshub.crt' ).toString();
var privateKey = fs.readFileSync( './keys/terasyshub.key' ).toString();

var options = {key: privateKey, cert: certificate};

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.host);

var router = express.Router();
app.use(router);

require('./prototypes');
require('./routes/route.main.js')(router);

https.createServer(options, app).listen(config.port).on('listening', function(){
    console.log('Listening https port '+config.port)
});