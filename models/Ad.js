const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  destinationUrl: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ad', adSchema);