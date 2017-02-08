var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Device = new Schema({
    "mac":{type:String, required:true},
    "name":{type:String},
    "description":{type:String},
    "createdat":{type:Number},
    "updatedat":{type:Number},
    "lastlocation": {
        lat: {type: String},
        lon: {type: String}
    }
});

Device.pre('save', function(next) {
    var now = moment().unix();
    if(!this.createdat)
        this.createdat = now;
    this.updatedat = now;
    next();
});

module.exports = mongoose.model('Device', Device);
