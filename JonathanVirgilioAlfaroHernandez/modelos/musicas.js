const mongoose = require('mongoose')

const MusicaShema = new mongoose.Schema({
    nombre:{
        type: String,
        require:true
    },

    artista:{
        type: String,
        require:true
    },

    genero:{
        type: Number,
        require:true 
    },

    precio:{
        type: Number,
        require:true
    },

    audio: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Musica', MusicaShema)