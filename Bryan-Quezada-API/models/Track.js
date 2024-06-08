const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    audio: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Track', trackSchema);