var metric = require('../metrics/control.metric');
var token = require('../tokens/control.token');

module.exports = function(io){

    io.on('connection', function(socket){

        console.log('Connected.');

        socket.on('register', function(data){

            if(!data.device)
                return console.log('No device specified.');

            if(!data.token)
                return console.log('No token provided.');

            token.checkDevice(data.token, data.device, function(err, valid){

                if(err){
                    console.log(err)
                }else if(valid){
                    console.log('Registered to device '+data.device);
                    socket.join(data.device);
                }

            })

        });

        socket.on('unregister', function(device){
            console.log('Unregistered from device '+device);
            socket.leave(device);
        });

        socket.on('getData', function(data){

            if(!data.type){
                socket.emit('messages', 'No data type specified.');
                return console.log('No data type specified.');
            }

            var mac = data.mac;
            var last = data.last;
            var type = data.type.trim().toLowerCase();

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
                since:last,
                sock:true
            };

            if(!data.mac)
                return socket.emit(type, {error:'Please login to use this socket.io endpoint'});
            if(!data.token)
                return console.log('No token provided.');

            token.checkDevice(data.token, data.mac, function(err, valid){

                if(err){
                    console.log(err);
                    return socket.emit(type, {error:'You do not have access to this device\'s data'});
                }else if(valid){
                    metric.get(type, mac, params, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            socket.emit(type, data);
                        }
                    });
                }

            });

        })

    });

    broadcast = function(room, data){
        io.sockets.in(room).emit(data.type, data);
    }

};