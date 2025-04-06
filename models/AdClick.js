const mongoose = require('mongoose');

const adClickSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad' },
  clickedAt: { type: Date, default: Date.now },
  // Puedes agregar más campos como IP, userAgent, etc.
});

module.exports = mongoose.model('AdClick', adClickSchema);