const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

// create a schema
const PresenceSchema = new Schema({
  id: Number,
  account_id: String,
  connection_id: Number,
  type: { type: String },
  asset: String,
  time: String,
  reason: String,
  createdOn: { type: Date, default: Date.now },
});

const Presence = mongoose.model('Presence', PresenceSchema);

module.exports = Presence;
