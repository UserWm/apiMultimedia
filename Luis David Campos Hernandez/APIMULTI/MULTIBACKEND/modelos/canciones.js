
const mongoose = require('mongoose');

const CancionSchema = new mongoose.Schema({
    nombreCancion: {
        type: String, 
        required: true
    },
    artistas: {
        type: String, 
        required: true
    },
    genero: {
        type: String, 
        required: true
    },
    precio: {
        type: Number, 
        required: true
    },
    audio: {
        type: String, 
        required: true
    }
});

module.exports = mongoose.model('Cancion', CancionSchema);
