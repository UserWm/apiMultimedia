const mongoose = require("mongoose");
const SongSchema = new mongoose.Schema({
  cancion: {
    type: String,
    require: true,
  },
  artista: {
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
module.exports = mongoose.model("Song", SongSchema);
