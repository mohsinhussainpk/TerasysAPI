var keys = require('../controllers/control.keys');

module.exports = function(router){

    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    router.route('/api/v1/data/*')

        .post(function(req, res, next){

            var mac = req.body.mac;
            var key = req.body.key;

            if(!mac || !key){
                res.status(400);
                return res.send('Invalid request. Missing MAC address or API key.')
            }

            keys.check(mac, key, function(err, success){

                if(err){
                    res.status(500);
                    res.send(err);
                }else{
                    next();
                }

            });

        });

    require('./route.device')(router);
    require('./route.temperature')(router);
    require('./route.humidity')(router);
    require('./route.keys')(router);

};