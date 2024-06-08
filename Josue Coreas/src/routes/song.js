const { Router } = require("express");
const multer = require("multer");
const Song = require("../models/song");
const path = require("path");
const fs = require("fs/promises");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/tracks");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/songs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/songs", upload.single("audio"), async (req, res) => {
  const { nombre, artistas, genero, precio } = req.body;
  const audio = req.file ? req.file.filename : null;
  try {
    const newSong = new Song({
      nombre,
      artistas,
      genero,
      precio,
      audio,
    });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/songs/:id", upload.single("audio"), async (req, res) => {
  const { id } = req.params;
  const { nombre, artistas, genero, precio } = req.body;
  const audio = req.file ? req.file.filename : null;
  try {
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }
    song.nombre = nombre || song.nombre;
    song.artistas = artistas || song.artistas;
    song.genero = genero || song.genero;
    song.precio = precio || song.precio;

    if (audio) {
      song.audio = audio;
    }

    await song.save();

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/songs/:id", async (req, res) => {
  const audioPath = path.join(__dirname, "../tracks");
  const { id } = req.params;
  try {
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }
    await song.deleteOne();
    if (song.audio) {
      await fs.unlink(path.join(audioPath, song.audio));
    }
    res.status(200).json({ message: "Canción eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
