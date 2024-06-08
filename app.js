const express = require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const app = express()
const port = 3000
const Path = require('path');

app.use(bodyParser.json())
const IP="127.0.0.1"
const mongoUri = `mongodb://${IP}:27017/dbmusica`;
app.use('/uploadsMusic',express.static(Path.join(__dirname,'uploadsMusic')))
app.use(express.static(Path.join(__dirname,'public')))
mongoose.connect(mongoUri)
    .then(()=>console.log('conectado exitosamente'))
    .catch(err=>console.log('error al conectar:',err))


const rutaProductos=require('./rutas/musica')
app.use('/musica',rutaProductos)
app.listen(port, () => console.log(`escuchando en ${port}!`))