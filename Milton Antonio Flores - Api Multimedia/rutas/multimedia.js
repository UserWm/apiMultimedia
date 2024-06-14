const express = require('express');
const rutas = express.Router();
const Cancion = require('../modelos/canciones');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Puppeteer = require('puppeteer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const carga = multer({storage:storage});

rutas.get('/', async (req, res) => {
    try{
        const canciones = await Cancion.find()
        res.status(200).json(canciones)
    }catch(err){
        res.status(500).json({error: err.message})
    }
});

rutas.get('/:id', async (req, res) => {
    try{
        const canciones = await Cancion.findById(req.params.id)
        if(!canciones){
            return res.status(404).json({error: 'Cancion no encontrada'})
        }
        res.status(200).json(canciones)
    }catch(error){
        res.status(500).json({error: err.message})
    }
})

rutas.post('/', carga.single('audio'), async function(req, res) {
    const {nombre, artista, genero, precio} = req.body;
    const audio = req.file ? req.file.filename : null;

    try{
        const nuevaCancion = new Cancion({nombre, artista, genero, precio, audio})
        await nuevaCancion.save();
        res.status(201).json(nuevaCancion)
    }catch(err){
        res.status(500).json({err: error.message})
    }
});

rutas.put('/:id', carga.single('audio'), async function (req, res) {
    const {nombre, artista, genero, precio} = req.body;
    const audio = req.file ? req.file.filename : null;
    try{
        const canciones = await Cancion.findById(req.params.id);
        if(!canciones){
            return res.status(404).json({error: 'Canción no encontrada'})
        }
        canciones.nombre = nombre || canciones.nombre
        canciones.artista = artista|| canciones.artista
        canciones.genero = genero || canciones.genero
        canciones.precio = precio || canciones.precio

        if(audio)
            canciones.audio = audio
        await canciones.save();
        res.status(200).json(canciones)
    }catch(err){
        res.status(500).json({error: error.message})
    }
});

rutas.delete('/:id', async function(req, res) {
    try{
        const canciones = await Cancion.findByIdAndDelete(req.params.id)
        if(!canciones){
            return res.status(404).json({error: 'Cancion no encontrada'})
        }
        if(canciones.audio){
            const audioPath = path.join(__dirname, '..', 'uploads', canciones.audio)
            fs.unlink(audioPath, (err) => {
                if(err){
                    console.log('Error al eliminar la cancion')
                }else{
                    console.log('Cancion eliminada: ', canciones.audio)
                }
            })
        }
        res.status(200).json({message: 'Cancion eliminada'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
});

module.exports = rutas

