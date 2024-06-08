const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Track = require('./models/Track');

const app = express();
const port = 3000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/multimedia');

app.use(bodyParser.json());
app.use(express.static('public'));

// Servir la carpeta 'tracks' como estática
app.use('/tracks', express.static(path.join(__dirname, 'tracks')));

// Configuración de Multer para almacenamiento de archivos en la carpeta "tracks"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tracks/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Endpoint para crear una nueva pista de audio
app.post('/api/tracks', upload.single('audio'), (req, res) => {
    const newTrack = new Track({
        name: req.body.name,
        artist: req.body.artist,
        genre: req.body.genre,
        price: req.body.price,
        audio: req.file.path, // Guardar la ruta del archivo en la base de datos
        imageUrl: req.body.imageUrl  // Guardar la URL de la imagen
    });

    newTrack.save()
        .then(track => res.json(track))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint para obtener todas las pistas de audio
app.get('/api/tracks', (req, res) => {
    Track.find()
        .then(tracks => res.json(tracks))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint para actualizar una pista de audio existente
app.put('/api/tracks/:id', (req, res) => {
    const updatedTrack = {
        name: req.body.name,
        artist: req.body.artist,
        genre: req.body.genre,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        audio: req.body.audio
    };

    Track.findByIdAndUpdate(req.params.id, updatedTrack, { new: true })
        .then(track => res.json(track))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint para eliminar una pista de audio
app.delete('/api/tracks/:id', (req, res) => {
    Track.findByIdAndDelete(req.params.id)
        .then(track => {
            if (track) {
                // Eliminar el archivo de audio del servidor
                fs.unlink(track.audio, err => {
                    if (err) res.status(500).json({ error: err.message });
                    else res.json({ message: 'Track deleted successfully' });
                });
            } else {
                res.status(404).json({ message: 'Track not found' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
