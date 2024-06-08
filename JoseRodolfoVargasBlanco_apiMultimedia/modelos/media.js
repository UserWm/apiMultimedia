const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const CancionSchema = new mongoose.Schema({
    nombreCancion: {
        type: String, 
        required: true
    },
    artista: {
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

module.exports = mongoose.model('Media', CancionSchema);
