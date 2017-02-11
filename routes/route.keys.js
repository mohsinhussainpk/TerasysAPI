var keys = require('../controllers/control.keys');

module.exports = function(router) {

    router.route('/api/v1/keys/:mac?')
        .post(function(req, res){

            var mac = req.body.mac;

            if(!mac){
                res.status(500);
                return res.send('Invalid request. Missing MAC address.')
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

        .get(function(req, res){

            var mac = req.params.mac;

            if(!mac){
                res.status(500);
                return res.send('Invalid request. Missing MAC address.')
            }

            keys.retrieve(mac, function(err, keys){

                if(err){
                    res.status(500);
                    res.send(err);
                }else{
                    res.send(keys)
                }

            });

        })

        .delete(function(req, res){

            var mac = req.body.mac;
            var key = req.body.key;

            if(!mac || !key){
                res.status(400);
                return res.send('Invalid request. Missing MAC address or API key.')
            }

            keys.deactivate(mac, key, function(err, success){

                if(err){
                    res.status(500);
                    res.send(err);
                }else{
                    res.send(success)
                }

            });

        })

};