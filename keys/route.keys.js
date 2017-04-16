var keys = require('./control.keys');
var passport = require('passport');

module.exports = function(router) {

    router.route('/api/v1/keys/:mac')
        .post(passport.authenticate('jwt', { session: false }), function(req, res){

            var mac = req.params.mac;

            if(!mac){
                res.status(500);
                return res.send('Invalid request. Missing MAC address.')
            }

            if(!req.user.devices[mac] && !req.user.admin){
                res.status(403);
                return res.send('You do not have access to this endpoint.');
            }

            keys.generate(mac, function(err, key){
                if(err){
                    res.status(500);
                    res.send(err);
                }else{
                    res.send(key)
                }
            });

        })

        .get(passport.authenticate('jwt', { session: false }), function(req, res){

            var mac = req.params.mac;

            console.log(req.user);

            if(!mac){
                res.status(500);
                return res.send('Invalid request. Missing MAC address.')
            }

            if(!req.user.devices[mac] && !req.user.admin){
                res.status(403);
                return res.send('You do not have access to this endpoint.');
            }

            keys.retrieve(mac, function(err, keys){

                if(err){
                    res.status(500);
                    res.send(err);
                }else{
                    res.send(keys)
                }

            });

        });

    /*
     .delete(passport.authenticate('jwt', { session: false }), function(req, res){

     var mac = req.params.mac;

     if(!mac || !key){
     res.status(400);
     return res.send('Invalid request. Missing MAC address or API key.')
     }

     if(!req.user.devices[mac] || !req.user.admin){
     res.status(403);
     return res.send('You do not have access to this device.');
     }

     keys.deactivate(mac, function(err, success){

     if(err){
     res.status(500);
     res.send(err);
     }else{
     res.send(success)
     }

     });

     });
     */

    router.route('/api/v1/keys/:mac/regen')
        .post(passport.authenticate('jwt', { session: false }), function(req, res){

            var mac = req.params.mac;

            if(!mac){
                res.status(500);
                return res.send('Invalid request. Missing MAC address.')
            }

            if(!req.user.devices[mac] && !req.user.admin){
                res.status(403);
                return res.send('You do not have access to this device.');
            }

            keys.regenerate(mac, function(err, key){
                if(err){
                    res.status(500);
                    res.send(err);
                }else{
                    res.send(key)
                }
            });

        })

};