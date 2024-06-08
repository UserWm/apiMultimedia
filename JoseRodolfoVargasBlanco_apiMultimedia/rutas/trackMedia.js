const express = require('express')
const rutas = express.Router()
const Media = require('../modelos/media')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'tracks/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const carga = multer({ storage: storage })

rutas.get('/', async(req, res) => {
    try {
        const medias = await Media.find()
        res.status(200).json(medias)
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

rutas.post('/', carga.single('audio'), async function(req, res) {
    const { nombreCancion, artista, genero, precio } = req.body
    const audio = req.file ? req.file.filename : null
    try {
        const nuevoMedia = new Media({ nombreCancion, artista, genero, precio, audio })
        await nuevoMedia.save()
        res.status(201).json(nuevoMedia)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

rutas.put('/:id', carga.single('audio'), async function(req, res) {
    const { nombreCancion, artista, genero, precio } = req.body
    const audio = req.file ? req.file.filename : null
    try {
        const medias = await Media.findById(req.params.id)
        if (!medias) return res.status(404).json({ error: 'Media no encontrado' })

        // Si hay una audio nueva, eliminar la antigua del sistema de archivos
        if (audio && medias.audio) {
            fs.unlink(path.join(__dirname, '../tracks', medias.audio), (err) => {
                if (err) console.log(err)
            })
        }

        medias.nombreCancion = nombreCancion || medias.nombreCancion
        medias.artista = artista || medias.artista
        medias.genero = genero || medias.genero
        medias.precio = precio || medias.precio
        if (audio) medias.audio = audio
        await medias.save()
        res.status(200).json(medias)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

rutas.delete('/:id', async function(req, res) {
    try {
        const medias = await Media.findByIdAndDelete(req.params.id)
        if (!medias) return res.status(404).json({ error: 'Media no encontrado' })

        // Eliminar la audio del sistema de archivos si existe
        if (medias.audio) {
            const audioPath = path.join(__dirname, '..', 'tracks', medias.audio)
            fs.unlink(audioPath, (err) => {
                if (err) {
                    console.log(err)
                }else{
                    console.log(`Imagen eliminada ${medias}`)
                }
            })
        }
        res.status(200).json({ message: 'Media eliminado' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

rutas.get('/:id', async(req, res) => {
    try {
        const medias = await Media.findById(req.params.id)
        if (!medias) return res.status(404).json({ error: 'Media no encontrado' })
        res.status(200).json(medias)
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = rutas
