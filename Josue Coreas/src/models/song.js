const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  nombre: {
    type: String,
    require: true,
  },
  artistas: {
    type: String,
    require: true,
  },
  genero: {
    type: String,
    require: true,
  },
  precio: {
    type: Number,
    require: true,
  },
  audio: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Song", songSchema);
