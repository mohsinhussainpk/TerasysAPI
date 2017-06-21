const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

// create a schema
const accountSchema = new Schema({
  name: { type: String, required: true, unique: true },
  createdOn: { type: Date, default: Date.now },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
