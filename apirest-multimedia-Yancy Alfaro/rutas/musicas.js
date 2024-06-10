const express = require('express')
const rutas = express.Router()
const Musica = require('../modelos/musicas')
const multer = require('multer');
const path = require('path')
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tracks/')
  },
  filename: function (req, file, cb){
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const carga = multer({storage: storage})

rutas.get('/', async (req, res) => {
  try {
    const musicas = await Musica.find()
    res.status(200).json(musicas)
  } catch (err) {
   res.status(500).json({error: err.message}) 
  }
})

rutas.post('/', carga.single('audio'), async function (req, res) {
  const {nombre, artista, genero, precio} = req.body
  const audio = req.file ? req.file.filename: null
  try {
    const nuevaMusica = new Musica({nombre, artista, genero, precio, audio})
    await nuevaMusica.save()
    res.status(201).json(nuevaMusica)
  } catch (error) {
    res.status(500).json({error})
  }
})


rutas.put('/:id', carga.single('audio'), async function(req, res) {
  const { nombre, artista, genero, precio } = req.body;
  const audio = req.file ? req.file.filename: null

  try {

    const musicas = await Musica.findById(req.params.id)
    if(!musicas)
        return res.status(404).json({error: 'Musica no encontrada'})

        musicas.nombre = nombre || musicas.nombre
        musicas.artista = artista || musicas.artista
        musicas.genero = genero || musicas.genero
        musicas.precio = precio || musicas.precio
        
        if(audio)
        musicas.audio=audio

        await musicas.save()
        res.status(200).json(musicas)
    
  } catch (err) {
    res.status(500).json({error: err.message})
  }
});


rutas.delete('/:id', async function(req, res) {
  try {
    const musicas = await Musica.findByIdAndDelete(req.params.id)
    if(!musicas)
      return res.status(404).json({error: 'Musica no encontrada'})
    if(musicas.audio){
      const audioPath = path.join(__dirname, '..', 'tracks', musicas.audio)
      fs.unlink(audioPath, (err) =>{
        if(err){
          console.log('error al eliminar la musica')
        }else{
          console.log('musica eliminada', musicas.audio)
        }
      })
    }
    res.status(200).json({message: 'Musica eliminada'})
  } catch (err) {
    res.status(500).json({error: err.message})
  }
});

rutas.get('/:id', async (req, res) => {
    try {
        const musicas = await Musica.findById(req.params.id)
        if(!musicas)
        return res.status(404).json({error: 'Musica no encontrada'})
        res.status(200).json(musicas)
      } catch (err) {
        res.status(500).json({error: err.message})
      }
})

module.exports = rutas