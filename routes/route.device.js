module.exports = function(router){

    router.route('/api/v1/devices/:device?')
        .get(function(req, res){

            var page = req.query.page;
            var results = req.query.results;
            var order = req.query.order;
            var filter = req.query.filter;
            var mac = req.params.device;

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

            if(mac){

                device.getOne(mac,function(err, data){
                    if(err){
                        console.log(err);
                        res.status(500);
                        res.send(err);
                    }else{
                        res.send(data);
                    }
                })

            }else{

                device.get(mac, params, function(err, data){
                    if(err){
                        console.log(err);
                        res.status(500);
                        res.send(err);
                    }else{
                        res.send(data);
                    }
                })

            }

        });

};