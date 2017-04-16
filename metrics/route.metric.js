var passport = require('passport');
var metric = require('./control.metric');
var device = require('../device/model.device');
var user = require('../auth/model.auth.js');
var async = require('async');

module.exports = function(router){

    router.route('/api/v1/data/:metric/:device')
        .get(passport.authenticate('jwt', { session: false }), function(req, res){

            var type = req.params.metric;

            var page = req.query.page;
            var results = req.query.results;
            var order = req.query.order;
            var filter = req.query.filter;
            var mac = req.params.device;

            if(!req.user){
                res.status(403);
                return res.send('Please login to access data.');
            }

            if(!req.user.admin && !req.user.devices[mac]){
                res.status(403);
                return res.send('You do not have access to this device\'s data.');
            }

            page = page ? page-1 : 0;
            results = results ? results : config.defaults.limit;
            filter = filter ? filter : config.defaults.filter;
            order = order ? order : 'desc';

            var params = {
                page:Number(page),
                results:Number(results),
                filter:filter,
                order:order
            };

            metric.get(type, mac, params, function(err, data){
                if(err){
                    console.log(err);
                    res.status(500);
                    res.send(err);
                }else{
                    res.send(data);
                }
            })

        });

    router.route('/api/v1/data')
        .post(function(req, res){

            var data = req.body;

            if(typeof data == 'string')
                data=JSON.parse(data);

            if(!data.metrics.length)
                return res.send('No metrics provided.');

            var dataToWrite = [];

            data.metrics.map(function(metric){
                var obj = {
                    mac : data.mac,
                    value : metric.value,
                    unit : metric.unit,
                    timestamp : data.timestamp,
                    type : metric.type,
                    location : data.location
                };
                dataToWrite.push(obj);
            });

            data.mac = data.mac.toLowerCase();

            device.findOne({mac:data.mac}, function(err, result){
                if(result){
                    result.updatedat = data.timestamp;
                    result.save();
                }
            });

            async.each(dataToWrite, function(obj, cb){

                metric.write(obj, function(err, data) {
                    if (err)
                        console.log(err);
                    cb();
                });

            }, function(){
                res.send('Ok.')
            });

        })

};