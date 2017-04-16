var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var views = new Schema({
    name: {type:String, required:true},
    userid: {type:String, required:true},
    dataTypes: [String],
    graphType: String,
    rangeFrom: Number,
    rangeTo: Number,
    colors:[String]
});

module.exports = mongoose.model('views', views, 'views');