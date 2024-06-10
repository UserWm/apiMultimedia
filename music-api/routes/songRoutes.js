const express = require('express');
const router = express.Router();
const {
  getSongs,
  getSongById,
  uploadSong,
  createSong,
  updateSong,
  deleteSong
} = require('../controllers/songController');

router.get('/', getSongs);
router.get('/:id', getSongById);
router.post('/', uploadSong, createSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

module.exports = router;
