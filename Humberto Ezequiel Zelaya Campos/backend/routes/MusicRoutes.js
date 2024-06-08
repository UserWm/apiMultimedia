import express from 'express';
import { GetAllMusic, GetMusicById, CreateMusic, updateMusic, deleteMusic, uploadFiles } from '../controllers/MusicController.js';

const router = express.Router();

router.get('/music', GetAllMusic);
router.get('/music/:id', GetMusicById);
router.post('/music', uploadFiles, CreateMusic);
router.put('/music/:id', uploadFiles, updateMusic);
router.delete('/music/:id', deleteMusic);

export default router;
