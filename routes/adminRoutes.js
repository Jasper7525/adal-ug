import express from 'express';
import { login, getVisitors } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Health endpoint makes it easy to verify that the browser is reaching the Express API.
router.get('/health', (_req, res) => res.json({ ok: true, service: 'adal-admin-api' }));
router.post('/login', login);
router.get('/visitors', requireAdmin, getVisitors);

export default router;
