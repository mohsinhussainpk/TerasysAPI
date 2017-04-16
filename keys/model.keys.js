var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var oldkey = new Schema({
    key:String,
    createdat:Number
},{_id:false});

var Key = new Schema({
    mac :{type:String, required:true},
    key :{type:String, required:true},
    old_keys:[oldkey],
    active :{type:Boolean, required:true},
    createdat :{type:Number}
});

Key.pre('save', function(next) {
    var now = moment();
    if(!this.createdat)
        this.createdat = now.unix();
    next();
});

module.exports = mongoose.model('Key', Key);
