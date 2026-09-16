import express from 'express';
import { getContent, getAdminContent, createContent, updateContent, deleteContent, uploadContentImage } from '../controllers/contentController.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { upload } from '../config/upload.js';

const router = express.Router();
router.get('/content', getContent);
router.get('/admin/content', requireAdmin, getAdminContent);
router.post('/admin/content', requireAdmin, createContent);
router.put('/admin/content/:id', requireAdmin, updateContent);
router.delete('/admin/content/:id', requireAdmin, deleteContent);
router.post('/admin/content/upload', requireAdmin, upload.single('image'), uploadContentImage);
export default router;
