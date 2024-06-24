const express = require('express');
const multer = require('multer');
const Track = require('../models/Track');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tracks/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Obtener todas las pistas
router.get('/tracks', async (req, res) => {
  try {
    const tracks = await Track.find();
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una nueva pista
router.post('/tracks', upload.single('audio'), async (req, res) => {
  const { nombre, artistas, genero, precio } = req.body;
  const audio = req.file.path;

  try {
    const newTrack = new Track({ nombre, artistas, genero, precio, audio });
    await newTrack.save();
    res.status(201).json(newTrack);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una pista
router.put('/tracks/:id', upload.single('audio'), async (req, res) => {
  const { nombre, artistas, genero, precio } = req.body;
  const audio = req.file ? req.file.path : undefined;

  try {
    const track = await Track.findById(req.params.id);
    if (audio && track.audio) {
      fs.unlinkSync(track.audio);
    }
    track.nombre = nombre;
    track.artistas = artistas;
    track.genero = genero;
    track.precio = precio;
    if (audio) track.audio = audio;
    await track.save();
    res.json(track);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una pista
router.delete('/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (track) {
      if (track.audio) {
        fs.unlinkSync(track.audio);
      }
      await track.remove();
      res.json({ message: 'Track deleted' });
    } else {
      res.status(404).json({ message: 'Track not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
