var metric = require('./model.metric.js');
var moment = require('moment');

module.exports = {

    write: function(data, cb){

        var datapoint = new metric(data);
        datapoint.save(function(err, res){
            if(err){
                cb(err);
            }else{
                broadcast(data.mac,data);
                cb(null, 'Success');
            }
        });

    },

    get: function(type, mac, params, cb){

        var skip = params.page*params.results;

        var sort = {};
        sort[params.filter]=1;
        if(params.order=='desc')
            sort[params.filter]=-1;

        var query = {
            type:type,
            mac:mac
        };

        console.log(query);
        console.log(params);

        if(params.sock){
            if(params.since){
                query.timestamp={$gte:params.since};
            }else{
                params.results=1;
            }
        }

        metric.find(query)
            .skip(skip)
            .limit(params.results)
            .sort(sort)
            .exec(function(err, data){
                console.log(data);
                if(err){
                    cb(err);
                }else{
                    cb(null, data);
                }
            })

    }

};