module.exports = {

    port:8088,
    defaults:{
        limit:10,
        filter:'timestamp'
    },
    mongodb:{
        host:'mongodb://localhost/terasys'
    }

};