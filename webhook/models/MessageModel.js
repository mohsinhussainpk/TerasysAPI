const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

// create a schema
const MessageSchema = new Schema({
  id: Number,
  account_id: String,
  parent_id: Number, 
  connection_id: Number,
  type: { type: String },
  channel: String,
  sender: String,
  recipient: String,
  b64_payload: String,
  asset: String,
  recorded_at: String,
  received_at: String,
  createdOn: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
