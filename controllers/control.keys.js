var random = require('random-js')();
var key = require('../models/model.keys');

module.exports = {

    generate: function(mac, cb){

        mac = mac.toLowerCase();

        key.findOne({mac:mac}, function(err, doc){

            if(doc){

                var k = doc.key;

                cb(null, k);

            }else{
                var k = random.hex(20, false);

                var newkey = new key({
                    mac:mac,
                    key:k,
                    active:true
                });

                console.log(k);

                newkey.save(function(err, data){
                    if(err) {
                        cb(err);
                    }else {
                        cb(null, k);
                    }
                })
            }

        });

    },

    retrieve: function(mac, cb){

        mac = mac.toLowerCase();

        key.find({mac:mac}, function(err, docs){
            if(err){
                console.log(err);
                cb(err, null)
            }else{
                cb(null, docs)
            }
        });

    },

    deactivate: function(mac, apikey, cb){

        mac = mac.toLowerCase();

        key.findOne({mac:mac, key:apikey}, function(err, doc){
            if(err){
                console.log(err);
                cb(err);
            }else{
                doc.active = false;
                doc.save();
                cb(null, true);
            }
        });

    },

    check: function(mac, apikey, cb){

        key.findOne({mac:mac, key:apikey}, function(err, doc){
            if(err){
                console.log(err);
                cb(err, false);
            }else{
                if(doc)
                    cb(null, true);
                else
                    cb(null, false);
            }
        });

    }

};