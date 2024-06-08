const mongoose = require('mongoose')
const TracksSchema = new mongoose.Schema({
    songName: {
        type:String,
        require:true
    },
    artist: {
        type:String,
        require:true
    },
    genre: {
        type:String,
        require:true
    },
    price: {
        type:Number,
        require:true
    },
    song: {
        type:String,
        require:true
    }
})


module.exports = mongoose.model('Tracks', TracksSchema)