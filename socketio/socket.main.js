var humidity = require('../controllers/control.humidity');
var temperature = require('../controllers/control.temperature');
var device = require('../controllers/control.device');

module.exports = function(io){

    io.on('connection', function (socket) {

        console.log('Device connected..');

        socket.on('temperature', function (data) {

            if(typeof data == 'string')
                data=JSON.parse(data);

            console.log(data);

            data.mac = data.mac.toLowerCase();

            device.write(data, function(err){
                if(err)
                    console.log(err);
            });

            temperature.write(data, function(err, res){
                if(err)
                    console.log(err);
            });
        });

        socket.on('humidity', function (data) {

            if(typeof data == 'string')
                data=JSON.parse(data);

            data.mac = data.mac.toLowerCase();

            device.write(data, function(err){
                if(err)
                    console.log(err);
            });

            humidity.write(data, function(err, res){
                if(err)
                    console.log(err);
            });
        });

    });

};