var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Humidity = new Schema({
    "mac":{type:String, required:true},
    "value":{type:Number, required:true},
    "unit":{type:String, required:true},
    "timestamp":{type:Number, required:true},
    "location": {
        lat: {type: String},
        lon: {type: String}
    }
});

module.exports = mongoose.model('Humidity', Humidity);
