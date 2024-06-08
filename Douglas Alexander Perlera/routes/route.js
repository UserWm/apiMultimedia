const express = require('express');
const multer = require('multer');
const Song = require('../models/model');
const path = require('path');
const mongoose = require('mongoose');

const music = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'audios/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const carga = multer({ storage: storage });


music.get('/', async (req, res) => {
  try {
      const songs = await Song.find();
      res.status(200).json(songs);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


music.post('/', carga.single('Audio'), async function (req, res) {
  const { Nombre, Artista, Genero, Precio, Img } = req.body;
  const Audio = req.file ? req.file.filename : null;

  if (!Nombre || !Artista || !Genero || !Precio ||!Img|| !Audio) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
      const nuevoMusic = new Song({ 
        Nombre, 
        Artista, 
        Genero, 
        Precio,
        Img, 
        Audio 
      });
      await nuevoMusic.save();
      res.status(201).json(nuevoMusic);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


music.put('/:id', carga.single('Audio'), async function (req, res) {
  const { id } = req.params;
  const { Nombre, Artista, Genero, Precio, Img } = req.body;
  const Audio = req.file ? req.file.filename : null;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID no válido' });
  }

  try {
      const song = await Song.findById(id);
      if (!song) {
          return res.status(404).json({ error: 'Producto no encontrado' });
      }

      song.Nombre = Nombre || song.Nombre;
      song.Artista = Artista || song.Artista;
      song.Genero = Genero || song.Genero;
      song.Precio = Precio || song.Precio;
      song.Img = Img || song.Img;
      if (Audio) {
        song.Audio = Audio;
      }

      await song.save();
      res.status(200).json(song);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = music;
