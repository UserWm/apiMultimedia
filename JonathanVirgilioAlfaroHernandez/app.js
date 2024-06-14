const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Path = require('path')

const app = express()

const port = 3000

app.use(bodyParser.json())

const mongoURI= 'mongodb://localhost:27017/DBProductos'

app.use('/uploads', express.static(Path.join(__dirname, 'uploads')))
app.use(express.static(Path.join(__dirname, 'public')))

mongoose.connect(mongoURI)
.then(()=> console.log('MongoDB conectado'))
.catch(err =>console.log(err))

const rutaProductos = require('./rutas/productos')
app.use('/api/producto', rutaProductos)

app.listen(port, () => console.log(`Servidor listo ${port}!`))