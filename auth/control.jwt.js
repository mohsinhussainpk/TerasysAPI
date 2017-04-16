var Strategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeader(),
    secretOrKey : config.secret,
    passReqToCallback: true
};

var user = require('./model.auth.js');
var token = require('../tokens/model.token');

module.exports = function(passport) {

    var strategy = new Strategy(opts, function(req, payload, done) {

        var reqtok = req.headers.authorization.replace('JWT ','').trim();

        token.findOne({token:reqtok}, function(err, tok){

            if(tok && tok.isValid()){

                user.findOne({_id:payload.id}, function(err, doc) {

                    console.log(doc);

                    if (err) {
                        console.log(err);
                        return done(err, false);
                    }
                    if (doc) {
                        var data = {
                            id:doc._id,
                            email:doc.email
                        };

                        var devices = {};
                        doc.devices.map(function(dev){
                            devices[dev] = 1;
                        });

                        data.devices = devices;

                        doc.isAdmin(function(admin) {
                            data.admin = admin;
                            return done(null, data);
                        });
                    } else {
                        console.log('User not found');
                        return done(null, false)
                    }
                });
            }else{
                console.log('Token not found.');
                done(null,false);
            }

        });
    });

    passport.use(strategy);

};