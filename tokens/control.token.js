var tokens = require('./model.token');
var user = require('../auth/model.auth');
var moment = require('moment');
var jwt = require('jsonwebtoken');

module.exports = {

    create: function(data, cb){

        data.exp = moment().add(config.tokenExpiry,'seconds').unix();

        var tok = new tokens({
            userid: data.id,
            token:data.token,
            expires:data.exp
        });

        tok.save(function(){
            cb();
        });

    },

    validate: function(token, cb){

        tokens.findOne({token:token}, function(err, tok){
            if(err){
                console.log(err);
                cb(err);
            }

            if(!tok)
                cb(null, false);

            if(!tok.isValid()){
                tok.remove();
                cb(null, false);
            }

            cb(null, true);

        })
    },

    remove: function(tok){

        tokens.findOne({token:tok}, function(err, token){
            token.remove();
        })

    },

    checkDevice: function(token, device, cb){

        jwt.verify(token, config.secret, function(err, decoded){

            if(err){
                console.log(err);
            }else {
                tokens.findOne({token: token}, function (err, tok) {

                    if (!tok) {
                        console.log('Token not found.');
                        return cb('Token not found.', null);
                    }

                    user.findOne({_id: decoded.id}, function (err, doc) {

                        var devices = {};

                        doc.devices.map(function (dev) {
                            devices[dev] = 1;
                        });

                        if(devices[device]){
                            return cb(false, true);
                        }else{
                            doc.isAdmin(function(admin){
                                if(admin)
                                    return cb(false,true);
                                return cb('Not authorized to access this device.', null);
                            });
                        }

                    });
                });
            }
        });

    }

};