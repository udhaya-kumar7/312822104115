const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema(
  {
    shortcode: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    expiryMinutes: { type: Number, default: 30 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Url', UrlSchema);
