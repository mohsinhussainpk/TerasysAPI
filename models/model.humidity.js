var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Humidity = new Schema({
    "mac":{type:String, required:true},
    "value":{type:Number, required:true},
    "unit":{type:String, required:true},
    "timestamp":{type:Number, required:true},
    "location": {
        lat: {type: Number},
        lon: {type: Number}
    }
});

Humidity.pre('save', function(next){
    var now = moment().unix();
    if(!this.timestamp)
        this.timestamp = now();
    next();
});

module.exports = mongoose.model('Humidity', Humidity);
