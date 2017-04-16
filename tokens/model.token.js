var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

var Token = new Schema({
    userid: {type:String, required:true},
    token :{type:String, required:true},
    expires: Number
});

Token.methods.isValid = function(){
    if(this.expires>=moment().unix()) {
        try {
            jwt.verify(this.token, config.secret);
        }catch(err){
            console.log('Invalid token.');
            this.remove();
            return false;
        }
        console.log('Token OK');
        return true;
    }else{
        this.remove();
        return false;
    }
};

module.exports = mongoose.model('Token', Token);
