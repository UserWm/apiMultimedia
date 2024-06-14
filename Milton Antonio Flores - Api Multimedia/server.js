const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.json())
const mongoURL = 'mongodb://localhost:27017/DBMultimedia'
app.use('/uploads', express.static(Path.join(__dirname, 'uploads')))
app.use(express.static(Path.join(__dirname, 'public')))

mongoose.connect(mongoURL)
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err))

const rutaMultimedia = require('./rutas/multimedia')
app.use('/api/music', rutaMultimedia)

app.listen(port, () => console.log(`Servidor listo ${port}!`))