const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    artista: { type: String, required: true },
    genero: { type: String, required: true },
    precio: { type: Number, required: true },
    audio: { type: String, required: true },
});

module.exports = mongoose.model('Track', trackSchema);