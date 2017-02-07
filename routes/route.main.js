var temperature = require('../controllers/control.temperature');
var humidity = require('../controllers/control.humidity');

module.exports = function(router){

    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    router.route('/api/v1/temperature')
        .get(function(req, res){

            var page = req.query.page;
            var results = req.query.results;
            var order = req.query.order;
            var filter = req.query.filter;

            page = page ? page-1 : 0;
            results = results ? results : config.defaults.limit;
            filter = filter ? filter : config.defaults.filter;
            order = order ? order : 'asc';

            var params = {
                page:Number(page),
                results:Number(results),
                filter:filter,
                order:order
            };

            temperature.get(params, function(err, data){
                if(err){
                    console.log(err);
                    res.status(500);
                    res.send(err);
                }else{
                    console.log('Temperature saved.')
                    res.send(data);
                }
            })

        });

    router.route('/api/v1/humidity')
        .get(function(req, res){

            var page = req.query.page;
            var results = req.query.results;
            var order = req.query.order;
            var filter = req.query.filter;

            page = page ? page-1 : 0;
            results = results ? results : config.defaults.limit;
            filter = filter ? filter : config.defaults.filter;
            order = order ? order : 'asc';

            var params = {
                page:Number(page),
                results:Number(results),
                filter:filter,
                order:order
            };

            temperature.get(params, function(err, data){
                if(err){
                    console.log(err);
                    res.status(500);
                    res.send(err);
                }else{
                    console.log('Humidity saved.');
                    res.send(data);
                }
            })

        });

};