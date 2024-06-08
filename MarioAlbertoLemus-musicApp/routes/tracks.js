const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Tracks = require('../models/tracks.js')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/tracks')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const load = multer({storage})

router.get('/', async (req, res) => {  
    try {
        const tracks = await Tracks.find()
        res.status(200).json(tracks)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post('/', load.single('track'), async function (req, res) {
    const track = req.file ? req.file.filename : null
    try {
        const tracks = await Tracks.create({
            songName: req.body.songName,
            artist: req.body.artist,
            genre: req.body.genre, 
            price: req.body.price,
            song: track
        })
        res.status(201).json(tracks)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.put('/:id', load.single('track'), async function(req, res) {
    const {id} = req.params
    const track = req.file ? req.file.filename : null
    try {
        const currentTrack = await Tracks.findOne({_id: id})
        const trackPath = path.join(__dirname, '..', 'uploads/tracks', currentTrack.song)
        console.log(track)
        console.log(trackPath)
        if (!currentTrack) {
            return res.status(404).json({error:'Track not found'})
        }
        await Tracks.updateOne({_id: id}, {
            songName: req.body.songName || currentTrack.songName,
            artist: req.body.artist || currentTrack.artist,
            genre: req.body.genre || currentTrack.genre, 
            price: req.body.price || currentTrack.price,
            song: track || currentTrack.song
        })
        res.status(200).json({message: 'Track updated'})
    } catch (error) {
        res.status(500).json({error:error.message})
    }    
});

router.delete('/:id', load.single('track'), async function(req, res) {
    const { id } = req.params;
    try {
        const currentTrack = await Tracks.findByIdAndDelete(id)
        if (!currentTrack) {
            return res.status(404).json({error: 'Track not found'})
        }
        else if(currentTrack.song) {
            const trackPath = path.join(__dirname, '..', 'uploads/tracks', currentTrack.song)
            fs.unlink(trackPath, (err) => {
                if (err) {
                    res.status(500).json({error: err.message})        
                } else {
                    res.status(200).json({message: 'Track deleted'})
                }
            })
        } else {
            res.status(200).json({message: 'Track deleted'})
        }
    } catch (error) {
        res.status(500).json({error: error.message})        
    }
});

module.exports = router