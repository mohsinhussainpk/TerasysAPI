var user = require('./model.auth.js');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'pass'
        },
        function (email, pass, done) {
            user.findOne({email: email.trim().toLowerCase()}, function (err, doc) {
                if (err) {
                    return done(err);
                }
                if (!doc) {
                    return done(null, false);
                }
                doc.verifyPassword(pass, function (ok) {
                    if (!ok) {
                        return done(null, false);
                    } else {
                        doc.updateLoggedIn();
                        return done(null, doc);
                    }
                })
            });
        }
    ));

    passport.serializeUser(function (user, cb) {

        var devices = {};
        user.devices.map(function(dev){
            devices[dev.mac] = dev.createdAt;
        });

        user.isAdmin(function(admin){
            cb(null, {_id:user.id, email: user.email, profile: user.profile, devices:devices, admin:admin});
        });

    });

    passport.deserializeUser(function (id, cb) {
        user.findOne({_id: id}, function (err, user) {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    });

};