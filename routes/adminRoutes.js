import express from 'express';
import { login, logout, resetPassword, getVisitors } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();
router.get('/health', (_req, res) => res.json({ ok: true, service: 'adal-admin-api' }));
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', resetPassword);
router.get('/visitors', requireAdmin, getVisitors);

export default router;
