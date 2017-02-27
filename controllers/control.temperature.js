var temperature = require('../models/model.temperature');
var moment = require('moment');

module.exports = {

    write: function(data, cb){

        var datapoint = new temperature(data);

        datapoint.save(function(err, res){
            if(err){
                cb(err);
            }else{
                data.type='temperature';
                broadcast(data.mac,data);
                cb(null, 'Success');
            }
        });

    },

    get: function(mac, params, cb){

        var skip = params.page*params.results;

        var sort = {};
        sort[params.filter]=1;
        if(params.order=='desc')
            sort[params.filter]=-1;

        var query = {
            mac:mac
        };

        if(params.sock){
            if(params.since){
                query.timestamp={$gte:params.since};
            }else{
                params.results=1;
            }
        }

        temperature.find(query,{},{skip:skip, limit:params.results, sort:sort},function(err, data){
            if(err){
                cb(err);
            }else{
                cb(null, data);
            }
        })

    }

};