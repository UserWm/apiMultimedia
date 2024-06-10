const express = require('express')
const rutas = express.Router()
const Musica = require('../modelos/musica')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'tracks/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const carga = multer ({storage:storage})

rutas.get('/', async(req, res) => {
    try {
        const music = await Musica.find()
        res.status(200).json(music)
    } catch (error) {
        res.status(500).json ({error:err.message})       
    }
})

rutas.post('/', carga.single('audio'), async function(req,res) {
    const { nombre, artista, genero, precio } = req.body
    const audio = req.file ? req.file.filename : null
    try {
        const nuevoProducto = new Musica({nombre, artista, genero, precio, audio})
        await nuevoProducto.save()
        res.status(201).json(nuevoProducto)
    } catch (error) {
        res.status(500).json({error:err.message})
    }
})


rutas.put('/:id', carga.single('audio'), async function(req, res) {
    const { nombre, artista, genero, precio } = req.body
    const audio = req.file ? req.file.filename : null
    try {
        const music = await Musica.findById(req.params.id)
        if(!music)
            return res.status(404).json({error:'Cancion no encontrada'})

                music.nombre = nombre || music.nombre
                music.artista = artista || music.artista
                music.genero = genero || music.genero
                music.precio = precio || music.precio   

            if(audio){
                music.audio = audio
            }
            await music.save()
            res.status(200).json(music)

    } catch (error) {
        res.status(500).json({error:err.message})
    }
})

rutas.delete('/:id', async function(req, res){
    try {
        const music = await Musica.findByIdAndDelete(req.params.id)
        if(!music)
        return res.status(404).json({error: 'Producto no encontrado'})
        if (music.audio) {
            const audioPath = path.join(__dirname, "..", "tracks", music.audio);
            fs.unlink(audioPath, (err) => {
              if (err) {
                console.log("error al eliminar");
              } else {
                console.log("Archivo eliminado", music.audio);
              }
            });
          }
        res.status(200).json({message: 'Canion eliminada'})
    } catch (error) {
        res.status(500).json({error:err.message})
    }
})

rutas.get('/:id', async(req, res) => {
    try {
        const music = await Musica.findById(req.params.id)
        if(!music)
            return res.status(404).json({error:'Cancion no encontrada'})
        res.status(200).json(music)
    } catch (error) {
        res.status(500).json ({error:err.message})       
    }
})

module.exports = rutas