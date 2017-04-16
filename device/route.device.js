var device = require('./control.device');
var passport = require('passport');

module.exports = function(router){

    router.route('/api/v1/devices/:device?')
        .get(passport.authenticate('jwt', { session: false }), function(req, res){

            var page = req.query.page;
            var results = req.query.results;
            var order = req.query.order;
            var filter = req.query.filter;
            var mac = req.params.device;


            page = page ? page-1 : 0;
            results = results ? results : config.defaults.limit;
            filter = filter ? filter : config.defaults.filter;
            order = order ? order : 'asc';

            var params = {
                page:Number(page),
                results:Number(results),
                filter:filter,
                order:order
            };

            if(mac){

                if(!req.user.devices[mac] && !req.user.admin){
                    res.status(403);
                    return res.send('You do not have access to this device.');
                }

                device.getOne(mac,function(err, data){
                    if(err){
                        console.log(err);
                        res.status(500);
                        res.send(err);
                    }else{
                        res.send(data);
                    }
                })

            }else if(req.user.devices){

                var macs = Object.keys(req.user.devices);

                device.get(macs, params, function(err, data){
                    if(err){
                        console.log(err);
                        res.status(500);
                        res.send(err);
                    }else{
                        res.send(data);
                    }
                })

            }else{
                res.send({});
            }

        })

        .post(passport.authenticate('jwt', { session: false }), function(req, res){

            if(!req.user.admin){
                res.status(403);
                return res.send('You do not have access to this endpoint.');
            }

            var data = req.body;

            var mac = req.params.device ? req.params.device.trim().toLowerCase() : data.mac.trim().toLowerCase();

            if(!mac){
                res.status(400);
                res.send('Please provide device mac address.')
            }

            if(!data){
                res.status(400);
                return res.send('Please provide data for device.');
            }

            data.mac=mac;

            /*
             if(!req.user.devices[mac] && req.user.admin){
             }
             */

            if(!data.email){
                res.status(400);
                return res.send('Please provide email of account to which to add device.');
            }

            if(req.user.admin){

                if(data.email){
                    var email = data.email.trim().toLowerCase();
                    device.writeByEmail(email, data, function(err,data){
                        if(err)
                            console.log(err);
                        res.send(data);
                    });
                }else{
                    device.writeSimple(data, function(err, data){
                        if(err)
                            console.log(err);
                        res.send(data);
                    })
                }

            }else{

                device.write(req.user.id, data, function(err){
                    if(err)
                        console.log(err);
                    res.send('Ok.');
                });

            }


        })

        .patch(passport.authenticate('jwt', { session: false }), function(req, res){

            if(!req.user.admin){
                res.status(403);
                return res.send('You do not have access to this endpoint.');
            }

            var data = req.body;

            var mac = req.params.device ? req.params.device.trim().toLowerCase() : data.mac.trim().toLowerCase();

            if(!mac){
                res.status(400);
                res.send('Please provide device mac address.')
            }

            if(!data){
                res.status(400);
                return res.send('Please provide data for device.');
            }

            data.mac=mac;

            device.edit(data,function(err, data){
                if(err){
                    console.log(err);
                    res.status(500);
                    res.send(err);
                }else{
                    res.send(data);
                }
            });

        })

        .delete(passport.authenticate('jwt', { session: false }), function(req, res){

            if(!req.user.admin){
                res.status(403);
                return res.send('You do not have access to this endpoint.');
            }

            var mac = req.params.device;

            if(!mac){
                res.status(400);
                return res.send('Device mac address required to make changes.');
            }

            device.remove(mac ,function(err, data){
                if(err){
                    console.log(err);
                    res.status(500);
                    res.send(err);
                }else{
                    res.send(data);
                }
            });

        })



};