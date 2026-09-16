import express from 'express';
import { login, getVisitors } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/login', login);
router.get('/visitors', requireAdmin, getVisitors);

export default router;
