const express = require('express')
const rutas = express.Router()
const Multimedia = require('../modelos/multimedia')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const carga = multer({storage: storage})

rutas.get('/', async (req, res) => {
    try {
        const pistas = await Multimedia.find()
        res.status(200).json(pistas)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

rutas.get('/:id', async (req, res) => {
    try {
        const pista = await Multimedia.findById(req.params.id)
        if (!pista) {
            return res.status(404).json({error: 'Pista no encontrada'})
        }
        res.status(200).json(pista)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

rutas.post('/', carga.fields([{ name: 'audio', maxCount: 1 }, { name: 'imagen', maxCount: 1 }]) , async (req, res) => {
    const { nombre, artista, genero, precio } = req.body
    const audio = req.files.audio ? req.files.audio[0].filename : null;
    const imagen = req.files.imagen ? req.files.imagen[0].filename : null;
    try {
        const nuevaPista = new Multimedia({nombre, artista, genero, precio, audio, imagen})
        await nuevaPista.save()
        res.status(201).json(nuevaPista)
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
})

rutas.put('/:id', carga.fields([{ name: 'audio', maxCount: 1 }, { name: 'imagen', maxCount: 1 }]) , async (req, res)=> {
    const { nombre, artista, genero, precio } = req.body
    const audio = req.files.audio ? req.files.audio[0].filename : null;
    const imagen = req.files.imagen ? req.files.imagen[0].filename : null;

    try {
        const pista = await Multimedia.findById(req.params.id)
        if (!pista) {
            return res.status(404).json({error: 'Pista no encontrada'})
        }
        
        pista.nombre = nombre || pista.nombre
        pista.artista = artista || pista.artista
        pista.genero = genero || pista.genero
        pista.precio = precio || pista.precio
        if (audio) {
            pista.audio = audio
        }
        if (imagen) {
            pista.imagen = imagen
        }

        await pista.save()
        return res.status(200).json(pista)
        } catch (err) {
        return res.status(500).json({error: err.message})
    }
})

rutas.delete('/:id', async (req, res)=> {
    try {
        const pista = await Multimedia.findByIdAndDelete(req.params.id)
        if (!pista) {
            return res.status(404).json({error: 'Pista no encontrada'})
        }
        if (pista.audio) {
            const audioPath = path.join(__dirname, '..', 'uploads', pista.audio)
            fs.unlink(audioPath, (err)=> {
                if (err) {
                    console.log('Error al eliminar la pista de audio');
                    } else {
                    console.log('Imagen eliminada', pista.audio);
                }
            })
        }
        if (pista.imagen) {
            const imagenPath = path.join(__dirname, '..', 'uploads', pista.imagen)
            fs.unlink(imagenPath, (err)=> {
                if (err) {
                    console.log('Error al eliminar la imagen');
                    } else {
                    console.log('Imagen eliminada', pista.imagen);
                }
            })
        }
        return res.status(200).json({message: 'Pista eliminada'})
        } catch (err) {
        return res.status(500).json({error: err.message})
    }
})

module.exports = rutas