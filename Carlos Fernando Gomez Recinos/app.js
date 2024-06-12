const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

const rutaCanciones = require('./routes/cancionesRoutes.js');

app.use('/audios', express.static(path.join(__dirname, 'audios')));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => 
// {
//     if((req.method === "POST" || req.method === "PUT") && 
//         (
//             !req.body.nombre ||
//             !req.body.artista ||
//             !req.body.genero ||
//             !req.body.precio ||
//             !req.body.audio
//         )
//     )
//     {
//         return res.status(400).json({error: "Debe cargar toda la informacion para almacenar"});
//     }
//     next();
// });

const mongoURI = process.env.URI;
mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Conectado"))
    .catch(error => console.error(error.message, error));

app.use('/canciones', rutaCanciones);

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(PORT, () => console.log(`Servidor Iniciado en: http://localhost:${PORT}!`));