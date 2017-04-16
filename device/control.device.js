var device = require('./model.device');
var user = require('../auth/model.auth');
var moment = require('moment');
var key = require('../keys/control.keys');
var _ = require('underscore');

module.exports = {

    writeSimple: function(data, cb){

        device.findOne({mac:data.mac}, function(err, result){

            if(!result){
                var dev = new device(data);
                dev.save(function(err){
                    if(err){
                        cb(err);
                    }else{
                        cb(null, 'Device created.');
                    }
                });
            }else {
                result.updatedat = data.timestamp;
                result.save(function(){

                    key.generate(data.mac, function(){

                    });

                    cb(null, 'Device exists.')
                });
            }

        })

    },

    write: function(userid, data, cb){

        if(data.mac){

            user.findOne({_id:userid}, function(err, doc){

                if(err) return cb(err);

                if(doc){

                    device.findOne({mac:data.mac}, function(err, result){

                        if(!result){
                            var dev = new device(data);
                            dev.save(function(err, res){
                                if(err){
                                    cb(err);
                                }else{

                                    doc.devices.push(mac);
                                    doc.devices = _.uniq(doc.devices);
                                    doc.save();

                                    key.generate(data.mac, function(){

                                    });

                                    cb(null, 'Success');

                                }
                            });
                        }else {
                            result.updatedat = data.timestamp;
                            result.save(function(){

                                cb(null, 'Device exists.')
                            });
                        }

                    })

                }else{
                    cb('User does not exist.');
                }

            })

        }else{
            cb('Missing device MAC address.');
        }

    },

    writeByEmail: function(email, data, cb){

        if(data.mac){

            user.findOne({email:email}, function(err, doc){

                if(err) return cb(err);

                if(doc){

                    device.findOne({mac:data.mac}, function(err, result){

                        if(!result){
                            var dev = new device(data);
                            dev.save(function(err, res){
                                if(err){
                                    cb(err);
                                }else{
                                    doc.devices.push(data.mac);
                                    doc.devices = _.uniq(doc.devices);
                                    doc.save();

                                    key.generate(data.mac, function(){

                                    });

                                    cb(null, 'Success');
                                }
                            });
                        }else {
                            result.updatedat = data.timestamp;
                            result.save(function(){
                                doc.devices.push(data.mac);
                                doc.devices = _.uniq(doc.devices);
                                doc.save();
                                cb(null, 'Device exists.')
                            });
                        }

                    })

                }else{
                    cb('User does not exist.');
                }

            })

        }else{
            cb('Missing device MAC address.');
        }

    },

    edit: function(data, cb){

        device.findOne({mac:data.mac}, function(err, dev){

            dev.name = data.name ? data.name : dev.name;
            dev.description = data.description ? data.description : dev.description;
            if(data.properties){
                for(var k in data.properties){
                    dev.properties[k] = data.properties[k];
                }
            }
            dev.save(function(err, data){
                if(err){
                    cb(err);
                }else{
                    cb(null, data);
                }
            })

        });

    },

    getOne: function(mac, cb){

        device.findOne({mac:mac},function(err, data){
            if(err){
                cb(err);
            }else{
                cb(null, data);
            }
        })

    },

    get: function(macs, params, cb){

        var skip = params.page*params.results;

        var sort = {};
        sort[params.filter]=1;
        if(params.order=='desc')
            sort[params.filter]=-1;

        var q = {};

        if(macs && macs.length)
            q.mac = {$in:macs};

        device.find(q,{},{skip:skip, limit:params.results, sort:sort},function(err, data){
            if(err){
                cb(err);
            }else{
                cb(null, data);
            }
        })

    },

    remove: function(mac, cb){

        device.findOne({mac:mac}, function(err, dev){

            if(dev){
                dev.remove(function(err){

                    if(err) {
                        cb('Device could not be removed');
                    }else{
                        user.find({devices:mac}, function(err, docs){
                            if(docs.length){
                                docs.map(function(doc){
                                    doc.devices = doc.devices.map(function(dev){
                                        if(dev!==mac)
                                            return dev;
                                    });
                                    doc.save();
                                })
                            }
                        });

                        key.removeDevice(mac, function(){

                        });
                        cb(null,'Device has been removed.')
                    }
                })
            }else{
                cb('Device not found.')
            }

        })

    }

};