const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  destinationUrl: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

adSchema.virtual('fullImageUrl').get(function() {
  if (this.imageUrl.startsWith('http')) {
    return this.imageUrl;
  }
  // Usa BASE_URL de las variables de entorno
  return `${process.env.BASE_URL || ''}${this.imageUrl}`;
});


module.exports = mongoose.model('Ad', adSchema);
