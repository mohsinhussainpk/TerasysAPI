var passport = require('passport');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var user = require('./model.auth.js');
var moment = require('moment');
var async = require('async');
var nodemailer = require('nodemailer');

var token = require('../tokens/model.token');
var tokens = require('../tokens/control.token');

module.exports = function(router){

    router.route('/api/v1/login')
        .post(function(req, res, next) {
            user.findOne({email: req.body.email.trim().toLowerCase()}, function (err, doc) {

                if (err) {
                    res.status(500);
                    return res.send(err);
                }

                if(!doc){
                    res.status(404);
                    return res.send('User not found.');
                }

                doc.verifyPassword(req.body.pass, function (ok) {
                    if(ok){

                        token.findOne({userid:doc._id}, function(err, tok) {

                            if (tok && tok.isValid()) {

                                doc.updateLoggedIn();
                                res.send(tok.token);

                            } else {

                                var newtoken = jwt.sign({
                                    id: doc._id
                                }, config.secret, {expiresIn: config.tokenExpiry});

                                tokens.create({id: doc._id, token: newtoken}, function () {
                                });

                                doc.updateLoggedIn();
                                res.send(newtoken);

                            }
                        });

                    }else{
                        res.send('Invalid password.');
                    }

                });

            });
        });

    router.route('/api/v1/logout')
        .post(passport.authenticate('jwt', { session: false }), function(req, res){
            token.findOne({userid:req.user.id}, function(err, tok){
                tok.remove();
            });
            res.send('User has been logged out. Token revoked.');
        });

    router.route('/api/v1/forgot')
        .post(function(req, res) {
            var userobj = '';
            async.waterfall([
                function(done) {
                    crypto.randomBytes(20, function(err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function(token, done) {
                    user.findOne({ email: req.body.email }, function(err, user) {
                        if (!user) {
                            res.status(404);
                            return res.send('No account with that email address exists.');
                        }

                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = moment().add(1,'hour').unix();

                        user.save(function(err) {
                            done(err, token, user);
                        });

                    });
                },
                function(token, user, done) {
                    var smtpTransport = nodemailer.createTransport({
                        service: 'SendGrid',
                        auth: {
                            user: config.sendgrid.user,
                            pass: config.sendgrid.pass
                        }
                    });
                    var mailOptions = {
                        to: user.email,
                        from: 'passwordreset@terasyshub.com',
                        subject: 'Terasyshub Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    };
                    userobj = user;
                    smtpTransport.sendMail(mailOptions, function(err) {
                        done(err, 'done');
                    });
                }
            ], function(err) {
                if (err){
                    console.log(err);
                    return res.send(err);
                }
                res.send('An e-mail has been sent to ' + userobj.email + ' with further instructions.');
            });
        });

    router.route('/api/v1/reset/:token')
        .get(function(req, res) {
            user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: moment().unix() } }, function(err, doc) {
                if (!doc) {
                    res.status(403);
                    return res.send('Password reset token is invalid or has expired.');
                }else{
                    return true;
                }
            });
        })

        .post(function(req, res){

            var data = req.body;
            var token = req.params.token;

            user.findOne({email: data.email, resetPasswordToken: token}, function(err, doc) {
                if (!doc) {
                    res.status(403);
                    return res.redirect('Password reset token is invalid or has expired.');
                }else{
                    if(!data.password || !data.password_confirm){
                        res.status(400);
                        return res.send('Please fill in password.');
                    }

                    if(data.password!=data.password_confirm) {
                        res.status(400);
                        return res.send('Passwords do not match.');
                    }

                    doc.verifyPassword(data.password, function(ok){
                        if(ok){
                            res.status(400);
                            return res.send('You cannot use the same password as before.');
                        }else{
                            doc.hashPassword(data.password, function(hash){

                                console.log(data.password);

                                doc.pass = hash;

                                doc.resetPasswordToken = '';
                                doc.resetPasswordExpires = 0;

                                doc.save(function(err){
                                    if(err)
                                        console.log(err);
                                    res.send('Password has been successfully changed.');
                                });
                            })
                        }
                    })
                }
            });
        });

    router.route('/api/v1/register')
        .post(passport.authenticate('jwt', { session: false }), function(req, res){

            user.isAdmin(req.user.id, function(admin) {

                if(!admin){
                    res.status(403);
                    return res.send('Please login as administrator to use this endpoint.');
                }

                var data = req.body;

                for(var k in data){
                    if(typeof data[k] == 'string')
                        data[k] = data[k].trim();
                }

                if(!data.password || !data.password_confirm){
                    res.status(400);
                    return res.send('Please fill in password.');
                }

                if(data.password!=data.password_confirm) {
                    res.status(400);
                    return res.send('Passwords do not match.');
                }

                user.findOne({email:data.email}, function(err, doc){
                    if(doc){
                        res.status(400);
                        return res.send('User already exists.');
                    }else{

                        var newuser = new user({
                            email:data.email,
                            profile:{
                                name:data.fullname
                            }
                        });

                        if(data.device){
                            newuser.devices = [{
                                mac:data.mac
                            }];
                        }else{
                            newuser.devices = [];
                        }

                        newuser.hashPassword(data.password, function(hash){

                            newuser.pass = hash;

                            newuser.save(function(err){
                                if(err)
                                    console.log(err);
                                return res.send('New user has been created.');
                            });

                        });

                    }
                });

            });

        });

    router.route('/api/v1/registerAdmin')
        .post(function(req, res){

            var key = req.body.key.trim();

            if(!key || key!==config.adminKey){
                res.status(403);
                return res.send('You do not have access to this endpoint.');
            }

            var data = req.body;

            for(var k in data){
                if(typeof data[k] == 'string')
                    data[k] = data[k].trim();
            }

            if(!data.password || !data.password_confirm){
                res.status(400);
                return res.send('Please fill in password.');
            }

            if(data.password!=data.password_confirm) {
                res.status(400);
                return res.send('Passwords do not match.');
            }

            user.findOne({email:data.email}, function(err, doc){
                if(doc){
                    res.status(400);
                    return res.send('User already exists.');
                }else{

                    var newuser = new user({
                        email:data.email,
                        profile:{
                            name:data.fullname
                        }
                    });

                    if(data.device){
                        newuser.devices = [{
                            mac:data.mac
                        }];
                    }else{
                        newuser.devices = [];
                    }

                    newuser.hashPassword(data.password, function(hash){

                        newuser.pass = hash;

                        newuser.save(function(err, data){
                            data.addAdmin(function(){
                            
                            });
                            if(err)
                                console.log(err);
                            return res.send('New user has been created.');
                        });

                    });

                }
            });

        });

    router.route('/api/v1/user/:id?')
        .get(passport.authenticate('jwt', { session: false }), function(req, res){

            var uid = req.user.id;

            if(req.user.admin && req.params.id)
                uid = req.params.id;

            user.findOne({_id:uid})
                .select('_id email updatedAt lastLogin profile devices')
                .exec(function(err, user){
                    if(err){
                        console.log(err);
                        res.send(err);
                    }else{
                        res.send(user);
                    }
                })

        })

        .patch(passport.authenticate('jwt', { session: false }), function(req, res){

            var uid = req.user.id;

            if(req.user.admin && req.params.id)
                uid = req.params.id;

            user.findOne({_id: uid}).exec(function (err, user) {

                user.profile = req.body.profile ? req.body.profile : user.profile;

                if(req.user.admin){
                    user.devices = req.body.devices ? req.body.devices : user.devices;
                    if(req.body.pass){
                        user.hashPassword(req.body.pass, function(hash){
                            user.pass = hash;
                            user.save(function (err) {
                                if (err) {
                                    console.log(err);
                                    res.send(err);
                                } else {
                                    res.send(true);
                                }
                            });
                        });
                    }else{
                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.send(err);
                            } else {
                                res.send(true);
                            }
                        });
                    }
                }else{
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else {
                            res.send(true);
                        }
                    });
                }

            })
        });

    /*router.route('/api/v1/user/removeDevice')
     .post(passport.authenticate('jwt', { session: false }),function(req, res) {

     var mac = req.body.device.trim().toLowerCase();
     var uid = req.user.id;

     if (req.user.admin && req.params.id)
     uid = req.params.id;

     if (!req.user.mac[mac]) {
     res.status(400);
     return res.send('Please provide mac address of device to be removed')
     }

     user.findOne({_id: uid}).exec(function (err, user) {

     if (req.user.admin) {
     user.devices = req.body.devices ? req.body.devices : user.devices;
     user.save(function (err) {
     if (err) {
     console.log(err);
     res.send(err);
     } else {
     res.send(true);
     }
     });
     }
     })

     });
     */

};