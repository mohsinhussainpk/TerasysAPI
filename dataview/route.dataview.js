var passport = require('passport');
var dataviews = require('./model.dataview');
var async = require('async');

module.exports = function(router){

    router.route('/api/v1/views/:uid')
        .get(passport.authenticate('jwt', { session: false }), function(req, res){

            var uid = req.user.id;

            if(req.user.admin){
                uid = req.params.uid;
            }

            dataviews.find({_id:uid}, function(err, docs){
                if(err){
                    res.status(500);
                    return res.send(err)
                }
                res.send(docs);
            })

        });

    router.route('/api/v1/views')
        .post(passport.authenticate('jwt', { session: false }), function(req, res){

            var data = req.body;

            if(!req.user.admin) {
                data.userid = req.user.id;
            }

            if(req.user.admin && !data.userid){
                res.status(400);
                return res.send('Please provide userid.');
            }

            var view = new dataviews(data);
            view.save(function(){
                res.send('New view has been created.')
            });

        })

        .patch(passport.authenticate('jwt', { session: false }), function(req, res){

            var data = req.body;

            if(req.user.admin && !data.userid){
                res.status(400);
                return res.send('Please provide userid.');
            }

            var query = {name:data.name};

            if(req.user.admin)
                query.userid = data.userid;
            else
                query.userid = req.user.id;

            dataviews.findOne(query, function(err, view){

                if(err){
                    res.status(500);
                    return res.send(err);
                }

                if(data.newname)
                    view.name = data.newname;
                view.dataTypes = data.dataTypes;
                view.graphType = data.graphtype;
                view.rangeFrom = data.rangeFrom;
                view.rangeTo = data.rangeTo;
                view.colors = data.colors;

                view.save(function(){
                    res.send('View has been updated.')
                });

            });

        })

        .delete(passport.authenticate('jwt', { session: false }), function(req, res){

            var data = req.body;

            if(req.user.admin && !data.userid){
                res.status(400);
                return res.send('Please provide userid.');
            }

            var query = {name:data.name};

            if(req.user.admin)
                query.userid = data.userid;
            else
                query.userid = req.user.id;

            dataviews.findOne(query, function(err, view){

                if(err){
                    res.status(500);
                    return res.send(err);
                }

                view.remove(function(){
                    res.send('View has been deleted.')
                });

            });

        })

};