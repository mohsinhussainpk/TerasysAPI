var temperature = require('../controllers/control.temperature');
var humidity = require('../controllers/control.humidity');

module.exports = function(io){

    io.on('connection', function(socket){

        console.log('Connected.');

        socket.on('register', function(device){
            socket.join(device);
        });

        socket.on('unregister', function(device){
            socket.leave(device);
        });


        socket.on('getData', function(data){

            console.log(data);

            var mac = data.mac;
            var last = data.last;
            var type = data.type;

            var page = 0;
            var results = 9999;
            var order = 'desc';
            var filter = config.defaults.filter;

            filter = filter ? filter : config.defaults.filter;

            last = last ? last : false;

            var params = {
                page:Number(page),
                results:Number(results),
                filter:filter,
                order:order,
                since:last
            };

            if(type=='temperature'){
                temperature.get(mac, params, function(err, data){
                    if(err){
                        console.log(err);
                    }else{
                        socket.emit('temperature', data);
                    }
                });
            }

            if(type=='humidity'){
                humidity.get(mac, params, function(err, data){
                    if(err){
                        console.log(err);
                    }else{
                        socket.emit('humidity', data);
                    }
                });
            }

        })

    });

    broadcast = function(room, data){
        io.sockets.in(room).emit(data.type, data);
    }

};