var keys = require('../keys/control.keys');
var token = require('../tokens/control.token');

var Middleware = require('../webhook/controllers/Middleware');
var MessageController = require('../webhook/controllers/MessageController');
var PresenceController = require('../webhook/controllers/PresenceController');
var TrackController = require('../webhook/controllers/TrackController');

module.exports = function(router){

    router.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
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
    router.route('/api/webhook-obd2')
        .post(
            Middleware.extractData,
            MessageController.saveMessageEvent,
            PresenceController.savePresenceEvent,
            TrackController.saveTrackEvent
        );

    router.route('/api/events/message')
        .post(MessageController.retrieveMessageEvents);

   router.route('/api/events/presence')
        .post(PresenceController.retrievePresenceEvents);

    router.route('/api/events/track')
        .post(TrackController.retrieveTrackEvents);

    require('./../auth/route.auth.js')(router);
    require('./../device/route.device')(router);
    require('./../metrics/route.metric')(router);
    require('./../keys/route.keys')(router);
    require('./../dataview/route.dataview')(router);

};