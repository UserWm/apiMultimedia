const express = require('express');
const multer = require('multer');
const path = require('path');
const CancionesDB = require('../models/cancionModel.js');
const cancionesR = express.Router();

const storage = multer.diskStorage
({
    destination: function (req, file, cb)
    {
        cb(null, 'audios/');
    },
    filename: function (req, file, cb)
    {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const carga = multer({storage: storage});

cancionesR.get('/', async (req, res) => 
{
    try
    {
        const canciones = await CancionesDB.find();
        res.status(200).json(canciones);
    }catch(error){
        console.error("Error al obtener las canciones", error.message);
        res.status(500).json({error: error.message});
    }
});

cancionesR.get('/:id', async (req, res) => 
{
    try {
        const cancion = await CancionesDB.findById(req.params.id);
        if(!cancion)
        {
            return res.status(404).json({error: "No se encontro la cancion"});
        }

        res.status(200).json(cancion);
    } catch (error) {
        console.error("Error al obtener la cancion", error.message);
        res.status(500).json({error: error.message});
    }
});

cancionesR.post('/', carga.single('audio'), async (req, res) => 
{
    const { nombre, artista, genero, precio } = req.body;
    const audio = req.file ? req.file.filename : null;
    try {
        const nuevaCancion = new CancionesDB({nombre, artista, genero, precio, audio});
        nuevaCancion.save();
        res.status(201).json(nuevaCancion);
    } catch (error) {
        console.error("Error al guardar cancion", error.message);
        res.status(500).json({erro: error.message});
    }
});

cancionesR.put('/:id', carga.single('audio'), async (req, res) => 
{
    const { nombre, artista, genero, precio } = req.body;
    const audio = req.file ? req.file.filename : null;
    try {
        const cancion = await CancionesDB.findById(req.params.id);
        if(!cancion)
        {
            return res.status(404).json({error: "No se encontro la cancion."});
        }

        cancion.nombre = nombre || cancion.nombre;
        cancion.artista = artista || cancion.artista;
        cancion.genero = genero || cancion.genero;
        cancion.precio = precio || cancion.precio;

        if(audio)
        {
            cancion.audio = audio;
        }

        await cancion.save();
        res.status(200).json(cancion);

    } catch (error) {
        console.erro("Error al actulizar el registro", error.message);
        res.status(500).json({error: error.message});
    }
});

cancionesR.delete('/:id', async (req, res) => 
{
    try {
        const cancion = await CancionesDB.findByIdAndDelete(req.params.id);
        if(!cancion)
        {
            return res.status(404).json({error: "No se encontro el recurso solicitado."});
        }

        res.status(204).end();

    } catch (error) {
        console.erro("Error al eliminar el registro", error.message);
        res.status(500).json({error: error.message});
    }
});

module.exports = cancionesR;