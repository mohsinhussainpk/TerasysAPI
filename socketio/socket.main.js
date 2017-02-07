var humidity = require('../controllers/control.humidity');
var temperature = require('../controllers/control.temperature');

module.exports = function(io){

    io.on('connection', function (socket) {

        console.log('Device connected..');

        socket.on('temperature', function (data) {
            temperature.write(data, function(err, res){
                if(err)
                    console.log(err);
            });
        });

        socket.on('humidity', function (data) {
            humidity.write(data, function(err, res){
                if(err)
                    console.log(err);
            });
        });

    });

};