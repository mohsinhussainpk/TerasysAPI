var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var moment = require('moment');

var admin = new Schema({
    userid: {type:String, required:true}
});

var admins = mongoose.model('admin', admin);

var userProfile = new Schema({

},{strict:false}, {_id:false });

var user = new Schema({
    email: {type:String, unique:true},
    pass: {type:String, required:true},
    updatedat: Number,
    createdat: Number,
    lastLogin: {type:Number, default:0},
    profile: userProfile,
    devices: [String],
    resetPasswordToken: String,
    resetPasswordExpires: Number
});

user.pre('save', function(next){
    var now = moment().unix();
    if(!this.createdat)
        this.createdat = now;
    this.updatedAt = now;
    next();
});

user.methods.isAdmin = function(cb){
    admins.findOne({userid:this._id}, function(err, admin){
        if(admin)
            return cb(true);
        cb(false);
    })
};

user.methods.addAdmin = function(cb){
    var newadmin = new admins({
        userid:this._id
    });
    newadmin.save(function(err){
        if(err)
            console.log(err);
        cb()
    })
};

user.methods.hasDevice = function(mac){

    var devices = {};
    this.devices.map(function(obj){
        devices[obj.mac] = obj.createdat;
    });

    return devices[mac];

};

user.methods.updateLoggedIn = function() {
    var now = moment().unix();
    this.model('users')
        .findOneAndUpdate({_id:this._id},{$set:{lastLogin:now}})
};

user.methods.updateLoggedIn = function() {
    var now = moment().unix();
    this.model('users')
        .findOneAndUpdate({_id:this._id},{$set:{lastLogin:now}})
};

user.methods.hashPassword = function(pass, cb) {
    bcrypt.hash(pass, 10, function(err, hash) {
        if(err)
            console.log(err);
        cb(hash);
    });
};

user.methods.verifyPassword = function(pass, cb){
    bcrypt.compare(pass, this.pass, function(err, res) {
        if(err)
            console.log(err);
        cb(res);
    });
};

module.exports = mongoose.model('users', user, 'users');