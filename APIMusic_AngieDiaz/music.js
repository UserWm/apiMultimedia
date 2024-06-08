const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

const trackSchema = new mongoose.Schema({
    nombre: String,
    artista: String,
    genero: String,
    precio: Number,
    audio: String,
});

const Pista = mongoose.model('Pista', trackSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'Pistas/');
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use('/Pistas', express.static('Pistas'));
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta public

app.get('/api/pistas', async (req, res) => {
    try {
        const pistas = await Pista.find();
        res.json(pistas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/pistas', upload.single('audio'), async (req, res) => {
    const { nombre, artista, genero, precio } = req.body;
    const audio = req.file ? req.file.filename : '';

    const nuevaPista = new Pista({
        nombre,
        artista,
        genero,
        precio,
        audio,
    });

    try {
        await nuevaPista.save();
        res.status(201).json(nuevaPista);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/pistas/:id', upload.single('audio'), async (req, res) => {
    try {
        const pistaEncontrada = await Pista.findById(req.params.id);
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, 'Pistas', pistaEncontrada.audio));
            pistaEncontrada.audio = req.file.filename;
        }
        pistaEncontrada.nombre = req.body.nombre;
        pistaEncontrada.artista = req.body.artista;
        pistaEncontrada.genero = req.body.genero;
        pistaEncontrada.precio = req.body.precio;

        await pistaEncontrada.save();
        res.json(pistaEncontrada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/pistas/:id', async (req, res) => {
    try {
        const pistaEncontrada = await Pista.findById(req.params.id);
        fs.unlinkSync(path.join(__dirname, 'Pistas', pistaEncontrada.audio));
        await pistaEncontrada.remove();
        res.json({ message: 'Pista eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
