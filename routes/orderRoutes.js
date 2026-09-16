import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();
router.post('/orders', createOrder);
router.get('/admin/orders', requireAdmin, getOrders);
router.patch('/admin/orders/:id/status', requireAdmin, updateOrderStatus);
export default router;
