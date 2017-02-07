var humidity = require('../models/model.humidity');
var moment = require('moment');

module.exports = {

    write: function(data, cb){

        if(!data.timestamp)
            data.timestamp = moment().unix();
        var datapoint = new humidity(data);
        datapoint.save(function(err, res){
            if(err){
                cb(err);
            }else{
                cb(null, 'Success');
            }
        });

    },

    get: function(params, cb){

        var skip = params.page*params.results;

        var sort = {};
        sort[params.filter]=1;
        if(params.order=='desc')
            sort[params.filter]=-1;

        humidity.find({},{},{skip:skip, limit:params.results, sort:sort},function(err, data){
            if(err){
                cb(err);
            }else{
                cb(null, data);
            }
        })

    }

};