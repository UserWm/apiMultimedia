import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    nameMusic: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    musicGenre: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    music: {
        type: String,
        required: true
    }
});

const Music = mongoose.model('Music', ProductSchema);

export default Music;
