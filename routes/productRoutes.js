import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImages,
  updateProductImage,
  deleteProductImage,
  uploadImage,
} from '../controllers/productController.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { upload } from '../config/upload.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/product-images', getProductImages);
router.post('/products', requireAdmin, createProduct);
router.put('/products/:id', requireAdmin, updateProduct);
router.delete('/products/:id', requireAdmin, deleteProduct);
router.put('/product-images/:id', requireAdmin, updateProductImage);
router.delete('/product-images/:id', requireAdmin, deleteProductImage);
router.post('/upload-image', requireAdmin, upload.single('image'), uploadImage);

export default router;
