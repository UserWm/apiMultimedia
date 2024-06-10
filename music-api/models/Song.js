const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  year: { type: Number },
  filePath: { type: String, required: true }
});

module.exports = mongoose.model('Song', songSchema);
