var keys = require('../keys/control.keys');
var token = require('../tokens/control.token');

module.exports = function(router){

    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    router.route('/api/v1/data')
        .post(function(req, res, next){

            var mac = req.body.mac;
            var key = req.body.key;

            if(!mac || !key){
                res.status(500);
                return res.send('Invalid request. Missing MAC address or API key.')
            }

            keys.check(mac, key, function(err, success){

                if(err){
                    res.status(500);
                    res.send(err);
                }else{
                    if(success){
                        next();
                    }else{
                        res.status(403);
                        res.send('Forbidden. Invalid API key.');
                    }
                }

            });
        });

    require('./../auth/route.auth.js')(router);
    require('./../device/route.device')(router);
    require('./../metrics/route.metric')(router);
    require('./../keys/route.keys')(router);
    require('./../dataview/route.dataview')(router);

};