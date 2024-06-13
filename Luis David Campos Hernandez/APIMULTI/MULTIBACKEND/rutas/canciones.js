const express = require('express');
const rutas = express.Router();
const Cancion = require('../modelos/canciones');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'tracks/');
    },
    filename: function(req, file, cb){
        cb(null, +Date.now() + path.extname(file.originalname));
    }
});
const carga = multer({storage: storage});

rutas.get('/', async (req, res) => {
    try {
        const canciones = await Cancion.find();
        res.status(200).json(canciones);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

rutas.post('/', carga.single('audio'), async function (req, res) {
    const {nombreCancion, artistas, genero, precio} = req.body;
    const audio = req.file ? req.file.filename : null;
    try {
        const nuevaCancion = new Cancion({nombreCancion, artistas, genero, precio, audio});
        await nuevaCancion.save();
        res.status(200).json(nuevaCancion);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

rutas.put('/:id', carga.single('audio'), async function (req, res) {
    const {nombreCancion, artistas, genero, precio} = req.body;
    const audio = req.file ? req.file.filename : null;
    try {
        const cancion = await Cancion.findById(req.params.id);
        if (!cancion) return res.status(404).json({error: 'Cancion no encontrada'});

        cancion.nombreCancion = nombreCancion || cancion.nombreCancion;
        cancion.artistas = artistas || cancion.artistas;
        cancion.genero = genero || cancion.genero;
        cancion.precio = precio || cancion.precio;
        
        

        if (audio) {
            if (cancion.audio) {
                const audioPath = path.join(__dirname, '..', 'tracks', cancion.audio);
                fs.unlink(audioPath, (err) => {
                    if (err) console.log('Error al eliminar el audio: ', cancion.audio);
                });
            }
            cancion.audio = audio;
        }
        
        await cancion.save();
        res.status(200).json(cancion);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

rutas.delete('/:id', async function(req, res) {
    try {
        const cancion = await   Cancion.findByIdAndDelete(req.params.id);
        if (!cancion) return res.status(404).json({error: 'Cancion no encontrada'});
        if (cancion.audio) {
            const audioPath = path.join(__dirname, '..', 'tracks', cancion.audio);
            fs.unlink(audioPath, (err) => {
                if (err) console.log('Error al eliminar el audio: ', cancion.audio);
            });
        }
        res.status(200).json({message: 'Cancion eliminada'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

rutas.get('/:id', async (req, res) => {
    try {
        const cancion = await Cancion.findById(req.params.id);
        if (!cancion) return res.status(404).json({error: 'Cancion no encontrada'});
        res.status(200).json(cancion);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = rutas;
