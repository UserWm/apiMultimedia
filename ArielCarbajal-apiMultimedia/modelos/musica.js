const mongoose = require('mongoose')
const Productoschema = new mongoose.Schema({
    nombre:{
        type: String,
        require: true
    },
    artista:{
        type: String,
        require: true
    },
    genero:{
        type: String,
        require: true
    },
    precio:{
        type: Number,
        require: true
    },
    audio:{
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Musica', Productoschema)