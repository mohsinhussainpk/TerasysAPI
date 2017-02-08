var device = require('../models/model.device');
var moment = require('moment');

module.exports = {

    write: function(data, cb){

        if(data.mac){

            device.findOne({mac:data.mac}, function(err, result){

                if(!result){

                    var dev = new device(data);
                    dev.save(function(err, res){
                        if(err){
                            cb(err);
                        }else{
                            cb(null, 'Success');
                        }
                    });
                }else {

                    result.updatedat = data.timestamp;
                    result.save();

                    cb(null, 'Device exists.')
                }

            })

        }else{
            cb('Missing device MAC address.');
        }

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

    get: function(mac, params, cb){

        var skip = params.page*params.results;

        var sort = {};
        sort[params.filter]=1;
        if(params.order=='desc')
            sort[params.filter]=-1;

        device.find({},{},{skip:skip, limit:params.results, sort:sort},function(err, data){
            if(err){
                cb(err);
            }else{
                cb(null, data);
            }
        })

    }

};