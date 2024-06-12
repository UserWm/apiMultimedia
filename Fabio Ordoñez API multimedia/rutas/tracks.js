const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Track = require('../modelos/tracks');

const rutas = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tracks/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

rutas.get('/', async (req, res) => {
    try {
        const tracks = await Track.find();
        res.status(200).json(tracks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

rutas.post('/', upload.single('audio'), async (req, res) => {
    const { nombre, artista, genero, precio } = req.body;
    const audioPath = `/tracks/${req.file.filename}`;

    const track = new Track({
        nombre, artista, genero, precio, audio: audioPath,
    });

    try {
        const newTrack = await track.save();
        res.status(201).json(newTrack);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

rutas.put('/:id', upload.single('audio'), async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        if (!track) {
            return res.status(404).json({ message: 'Track no encontrado' });
        }
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '..', track.audio));
            track.audio = `/tracks/${req.file.filename}`;
        }

        const { nombre, artista, genero, precio } = req.body;
        if (nombre) track.nombre = nombre;
        if (artista) track.artista = artista;
        if (genero) track.genero = genero;
        if (precio) track.precio = precio;

        const trackActualizado = await track.save();
        res.status(200).json(trackActualizado);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

rutas.delete('/:id', async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        if (!track) {
            return res.status(404).json({ message: 'Track no encontrado' });
        }
        fs.unlinkSync(path.join(__dirname, '..', track.audio));
        await track.remove();
        res.status(200).json({ message: 'Track eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = rutas;