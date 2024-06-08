import Music from '../models/MusicModels.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

export const GetAllMusic = async (req, res) => {
    try {
        const musicas = await Music.find();
        res.status(200).json(musicas);
        console.log('¡Musicas obtenidas exitosamente!');
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log('Error del servidor: obtener Musicas, estado 500');
    }
};

export const GetMusicById = async (req, res) => {
    const { id } = req.params;
    try {
        const musica = await Music.findById(id);
        if (!musica) {
            return res.status(404).json({ message: 'Musica no encontrada' });
        }
        res.status(200).json(musica);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const CreateMusic = async (req, res) => {
    const { nameMusic, artist, musicGenre, price } = req.body;
    const imagen = req.files['imagen'] ? req.files['imagen'][0].filename : null;
    const music = req.files['music'] ? req.files['music'][0].filename : null;

    if (!imagen || !music) {
        return res.status(400).json({ message: 'La imagen y la musica son requeridas' });
    }

    try {
        const newMusic = new Music({ nameMusic, artist, musicGenre, price, imagen, music });
        await newMusic.save();
        res.status(201).json(newMusic);
        console.log('Nueva musica creada exitosamente, estado 201');
    } catch (err) {
        res.status(400).json({ message: err.message });
        console.log('Error al crear la musica, estado 400');
    }
};

export const updateMusic = async (req, res) => {
    const { id } = req.params;
    const { nameMusic, artist, musicGenre, price } = req.body;
    const imagen = req.files['imagen'] ? req.files['imagen'][0].filename : null;
    const music = req.files['music'] ? req.files['music'][0].filename : null;

    try {
        const musicToUpdate = await Music.findById(id);
        if (!musicToUpdate) {
            return res.status(404).json({ message: 'Musica no encontrada' });
        }


        if (imagen) {
            const oldImagePath = path.join('uploads', musicToUpdate.imagen);
            if (fs.existsSync(oldImagePath)) {
                console.log(`Eliminando imagen antigua: ${oldImagePath}`);
                fs.unlinkSync(oldImagePath);
            } else {
                console.log(`La imagen antigua no existe: ${oldImagePath}`);
            }
            musicToUpdate.imagen = imagen;
        }


        if (music) {
            const oldMusicPath = path.join('uploads', musicToUpdate.music);
            if (fs.existsSync(oldMusicPath)) {
                console.log(`Eliminando musica antigua: ${oldMusicPath}`);
                fs.unlinkSync(oldMusicPath);
            } else {
                console.log(`La musica antigua no existe: ${oldMusicPath}`);
            }
            musicToUpdate.music = music;
        }

        musicToUpdate.nameMusic = nameMusic;
        musicToUpdate.artist = artist;
        musicToUpdate.musicGenre = musicGenre;
        musicToUpdate.price = price;

        const updatedMusic = await musicToUpdate.save();
        res.status(200).json(updatedMusic);
    } catch (err) {
        res.status(400).json({ message: err.message });
        console.log('Error al actualizar la musica:', err.message);
    }
};

export const deleteMusic = async (req, res) => {
    const { id } = req.params;
    try {
        const musicToDelete = await Music.findByIdAndDelete(id);
        if (!musicToDelete) {
            return res.status(404).json({ message: 'Musica no encontrada' });
        }


        const imagePath = path.join('uploads', musicToDelete.imagen);
        if (fs.existsSync(imagePath)) {
            console.log(`Eliminando imagen: ${imagePath}`);
            fs.unlinkSync(imagePath);
        } else {
            console.log(`La imagen no existe: ${imagePath}`);
        }


        const musicPath = path.join('uploads', musicToDelete.music);
        if (fs.existsSync(musicPath)) {
            console.log(`Eliminando musica: ${musicPath}`);
            fs.unlinkSync(musicPath);
        } else {
            console.log(`La musica no existe: ${musicPath}`);
        }

        res.status(200).json({ message: 'Musica eliminada exitosamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const uploadFiles = upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'music', maxCount: 1 }
]);
