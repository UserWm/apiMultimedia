const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');



const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/DBPAudios';
app.use('/tracks', express.static(path.join(__dirname, 'tracks')));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

// Servir archivos estáticos



// Rutas de Productos
const rutaCanciones = require('./rutas/canciones');
app.use('/api/canciones', rutaCanciones);

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
