const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const rutas = require("./rutas/tracks");

const app = express();
const port = 3000;

const mongoURI = 'mongodb://localhost:27017/dbTrack';
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Establecida la conexión con MongoDB');
    }).catch(err => {
        console.log(err);
    });

// app.use(bodyParser.json());
app.use(express.json());
app.use('/tracks', express.static(path.join(__dirname, 'tracks')));
app.use('/api/tracks', rutas);

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor listo en http://localhost:${port}`);
});