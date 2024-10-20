const express = require('express');
const mongoose = require('mongoose');
const rutamusic = require('./routes/route.js');
const path = require('path');

const app = express();
const port = 3000;

const mongoURI = "mongodb+srv://admin:root@cluster0.si8zhss.mongodb.net/DbMusic?retryWrites=true&w=majority&appName=Cluster0";


app.use(express.json());
app.use('/audios', express.static(path.join(__dirname, 'audios')));
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));


app.use('/music', rutamusic);

app.listen(port, () => console.log(`Aplicación escuchando en el puerto ${port}!`));
