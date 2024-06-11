const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    Nombre: {
        type: String,
        required: true
    },
    Artista: {
        type: String,
        required: true
    },
    Genero: {
        type: String,
        required: true
    },
    Precio: {
        type: Number,
        required: true
    },
    Img: {
        type: String,
        required: true
    },
    Audio: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Music', SongSchema);
