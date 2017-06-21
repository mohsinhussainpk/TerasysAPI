const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

// create a schema
const TrackSchema = new Schema({
  account_id: String,
  id: Number,
  connection_id: Number,
  index:  Number,
  asset: String,
  recorded_at: String,
  recorded_at_ms: String,
  received_at: String,
  fields: Object,
  createdOn: { type: Date, default: Date.now },
});

const Track = mongoose.model('Track', TrackSchema);

module.exports = Track;
