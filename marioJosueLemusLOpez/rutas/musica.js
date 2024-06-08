const express = require('express');
const rutas = express.Router();
const Cancion = require('../modelos/musica');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploadsMusic/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const carga = multer({ storage: storage });

rutas.get('/:id', async (req, res) => {
  try {
    const cancion = await Cancion.findById(req.params.id);
    res.status(200).json(cancion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

rutas.get('/', async (req, res) => {
  try {
    const canciones = await Cancion.find();
    res.status(200).json(canciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

rutas.post('/', carga.single('audio'), async function (req, res) {
  
  const { nombre, artista, genero, precio } = req.body;
  const audio = req.file ? req.file.filename : null;
  try {
    const nuevaCancion = new Cancion({ nombre, artista, genero, precio, audio });
    await nuevaCancion.save();
    res.status(200).json(nuevaCancion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

rutas.put('/:id', carga.single('audio'), async function (req, res) {
  
  const { nombre, artista, genero, precio } = req.body;
  const audio = req.file ? req.file.filename : null;
  try {
    const cancion = await Cancion.findById(req.params.id);
    if (!cancion) {
      return res.status(404).json({ error: 'Cancion no encontrada' });
    }
    cancion.nombre = nombre || cancion.nombre;
    cancion.artista = artista || cancion.artista;
    cancion.genero = genero || cancion.genero;
    cancion.precio = precio || cancion.precio;
    if (audio) {
      cancion.audio = audio;
    }
    await cancion.save();
    res.status(200).json(cancion);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

rutas.delete('/:id', async function (req, res) {
  try {
    const cancion = await Cancion.findByIdAndDelete(req.params.id);
    if (!cancion) {
      return res.status(404).json({ error: 'Cancion no encontrada' });
    }
    if (cancion.audio) {
      const pathRuta = path.join(__dirname, '..', 'uploadsMusic', cancion.audio);
      fs.unlink(pathRuta, (err) => {
        if (err) {
          console.log("Error al eliminar audio");
        } else {
          console.log("Audio eliminado");
        }
      });
    }
    res.status(200).json({ message: "Audio eliminado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = rutas;
