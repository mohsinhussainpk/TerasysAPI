module.exports = {

    port:8080,
    defaults:{
        limit:10,
        filter:'timestamp'
    },
    mongodb:{
        host:'mongodb://localhost/terasys'
    }

};