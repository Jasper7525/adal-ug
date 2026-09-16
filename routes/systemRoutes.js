import express from 'express';
import { health, requirements } from '../controllers/systemController.js';

const router = express.Router();

router.get('/health', health);
router.get('/requirements', requirements);

export default router;
