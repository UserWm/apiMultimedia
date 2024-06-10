const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Path = require('path')

const app = express()

const port = 3000

app.use(bodyParser.json())

const mongoURI= 'mongodb://localhost:27017/DBMusical'

app.use('/tracks', express.static(Path.join(__dirname, 'tracks')))
app.use(express.static(Path.join(__dirname, 'public')))

mongoose.connect(mongoURI)
.then(()=> console.log('MongoDB conectado'))
.catch(err =>console.log(err))

const rutaMusica = require('./rutas/musicas')
app.use('/api/musica', rutaMusica)

app.listen(port, () => console.log(`Servidor listo ${port}!`))