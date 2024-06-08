const express = require("express");
const rutas = express.Router();
const Song = require("../modelos/songs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const carga = multer({ storage: storage });

rutas.get("/", async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

rutas.post("/", carga.single("audio"), async (req, res) => {
  const { cancion, artista, genero, precio } = req.body;
  const audio = req.file ? req.file.filename : null;
  try {
    const newSong = new Song({
      cancion,
      artista,
      genero,
      precio,
      audio,
    });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(500).json("pedillos");
    console.log(err);
  }
});

rutas.put("/:id", carga.single("audio"), async (req, res) => {
  const { cancion, artista, genero, precio } = req.body;
  const audio = req.file ? req.file.filename : null;
  try {
    const songs = await Song.findById(req.params.id);
    if (!songs) {
      return res.status(404).json({ error: "Not Song Found" });
    }

    songs.cancion = cancion || songs.cancion;
    songs.artista = artista || songs.artista;
    songs.genero = genero || songs.genero;
    songs.precio = precio || songs.precio;
    if (audio) {
      songs.audio = audio;
    }
    await songs.save();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

rutas.delete("/:id", async (req, res) => {
  try {
    const songs = await Song.findByIdAndDelete(req.params.id);
    if (!songs) {
      return res.status(404).json({ error: "Song Not Found" });
    }
    if (songs.audio) {
      const SongsPath = path.join(__dirname, "..", "uploads", songs.audio);
      fs.unlink(SongsPath, (err) => {
        if (err) {
          console.log("We couldn't delete");
        } else {
          console.log("Song Deleted", songs.audio);
        }
      });
    }
    res.status(200).json({ message: "Song Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

rutas.get("/:id", async (req, res) => {
  try {
    const songs = await Song.findById(req.params.id);
    if (!songs) return res.status(404).json({ error: "Song Not Found" });
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = rutas;
