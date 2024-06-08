const express = require('express');
const multer = require('multer');
const Track = require('../models/Track');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// ConfiguraciÃ³n de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tracks/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET todas las pistas
router.get('/', async (req, res) => {
    try {
        const tracks = await Track.find();
        res.json(tracks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST una nueva pista
router.post('/', upload.single('audio'), async (req, res) => {
    const { name, artist, genre, price } = req.body;
    const audio = req.file.filename;
    const newTrack = new Track({ name, artist, genre, price, audio });

    try {
        const savedTrack = await newTrack.save();
        res.status(201).json(savedTrack);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT actualizar una pista
router.put('/:id', upload.single('audio'), async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        if (!track) return res.status(404).json({ message: 'Track not found' });

        if (req.file) {
            // Eliminar el archivo antiguo
            fs.unlink(path.join(__dirname, '../tracks', track.audio));
            track.audio = req.file.filename;
        }

        track.name = req.body.name || track.name;
        track.artist = req.body.artist || track.artist;
        track.genre = req.body.genre || track.genre;
        track.price = req.body.price || track.price;

        const updatedTrack = await track.save();
        res.json(updatedTrack);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE eliminar una pista
router.delete('/:id', async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        if (!track) return res.status(404).json({ message: 'Track not found' });

        // Eliminar el archivo
       await fs.unlink(path.join(__dirname, '../tracks', track.audio));


        await Track.deleteOne({ _id: req.params.id});
        res.json({ message: 'Track Borrado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;