import fs from 'fs';
import path from 'path';
import { query } from '../db/postgres.js';
import { uploadDir } from '../config/upload.js';

const defaultProducts = [
  { id: 1, code: '3KG', name: '3kg Camping Cylinder', size: '3kg', category: '3kg', price: 32000, description: 'Portable LPG cylinder', image_url: '/uploads/default-3kg.jpg' },
  { id: 2, code: '6KG', name: '6kg Domestic Cylinder', size: '6kg', category: '6kg', price: 55000, description: 'Household LPG cylinder', image_url: '/uploads/default-6kg.jpg' },
  { id: 3, code: '12.5KG', name: '12.5kg Family Cylinder', size: '12.5kg', category: '12.5kg', price: 90000, description: 'Family LPG cylinder', image_url: '/uploads/default-12.5kg.jpg' },
  { id: 4, code: '38KG', name: '38kg Commercial Cylinder', size: '38kg', category: '38kg', price: 180000, description: 'Commercial LPG cylinder', image_url: '/uploads/default-38kg.jpg' },
  { id: 5, code: 'ACCESSORIES', name: 'Accessories', size: 'accessories', category: 'accessories', price: 0, description: 'Gas accessories and safety kit', image_url: '/uploads/default-accessories.jpg' },
];

export async function getProducts(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(defaultProducts);
    }

    const result = await query(`
      SELECT p.id, p.code, p.name, p.size, p.category, p.price, p.description,
             p.image_url, COALESCE(pi.image_url, p.image_url) AS image_url_from_db,
             p.created_at
      FROM adal_products p
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM adal_product_images
        WHERE product_code = p.code
        ORDER BY uploaded_at DESC, id DESC
        LIMIT 1
      ) pi ON true
      ORDER BY p.id ASC
    `);

    return res.json(result.rows.map(row => ({
      ...row,
      image_url: row.image_url_from_db || row.image_url,
    })));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getProductImages(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      const imageStore = req.app.locals.imageStore || [];
      return res.json(imageStore.length > 0 ? imageStore : [
        { id: 1, product_code: '3KG', image_url: '/uploads/default-3kg.jpg', image_name: '3kg Cylinder', mime_type: 'image/jpeg', size_bytes: 0, category: 'cylinder', price: 32000, description: '3kg cylinder image' },
      ]);
    }

    const result = await query('SELECT * FROM adal_product_images ORDER BY uploaded_at DESC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateProductImage(req, res) {
  try {
    const imageId = Number(req.params.id);
    const { productCode, category, imageName, price, description } = req.body || {};

    if (!process.env.DATABASE_URL) {
      const imageStore = req.app.locals.imageStore || [];
      const image = imageStore.find(item => item.id === imageId);
      if (!image) return res.status(404).json({ message: 'Image not found.' });

      image.product_code = productCode || image.product_code;
      image.category = category || image.category || 'cylinder';
      image.image_name = imageName || image.image_name;
      image.price = Number(price ?? image.price ?? 0);
      image.description = description || image.description || '';

      return res.json({ success: true, updated: image });
    }

    const result = await query(
      `UPDATE adal_product_images
       SET product_code = COALESCE($1, product_code),
           category = COALESCE($2, category),
           image_name = COALESCE($3, image_name),
           price = COALESCE($4, price),
           description = COALESCE($5, description)
       WHERE id = $6
       RETURNING *`,
      [productCode, category, imageName, Number(price ?? 0), description, imageId]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Image not found.' });
    return res.json({ success: true, updated: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteProductImage(req, res) {
  try {
    const imageId = Number(req.params.id);
    const removeFile = imageUrl => {
      if (!imageUrl) return;
      const filePath = path.join(uploadDir, path.basename(imageUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    };

    if (!process.env.DATABASE_URL) {
      const imageStore = req.app.locals.imageStore || [];
      const index = imageStore.findIndex(image => Number(image.id) === imageId);
      if (index >= 0) {
        removeFile(imageStore[index].image_url);
        imageStore.splice(index, 1);
      }
      return res.json({ success: true, deletedId: imageId });
    }

    const result = await query(
      'DELETE FROM adal_product_images WHERE id = $1 RETURNING image_url, image_name',
      [imageId]
    );

    if (result.rows.length > 0) removeFile(result.rows[0].image_url);
    return res.json({ success: true, deletedId: imageId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function uploadImage(req, res) {
  try {
    const productCode = String(req.body.productCode || 'ACCESSORIES').toUpperCase();
    const category = String(req.body.category || 'cylinder').toLowerCase();
    const imageName = String(req.body.imageName || req.file?.originalname || 'Uploaded image');
    const price = Number(req.body.price || 0);
    const description = String(req.body.description || '');
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No image file provided.' });

    const imageUrl = `/uploads/${file.filename}`;

    if (!process.env.DATABASE_URL) {
      const imageStore = req.app.locals.imageStore || [];
      const image = {
        id: req.app.locals.imageStoreSequence++,
        product_code: productCode,
        category,
        image_url: imageUrl,
        image_name: imageName,
        mime_type: file.mimetype,
        size_bytes: file.size,
        uploaded_at: new Date().toISOString(),
        price,
        description,
      };
      imageStore.push(image);
      return res.json({ success: true, imageUrl, fileName: imageName, productCode, category, price, description });
    }

    await query(
      `INSERT INTO adal_product_images
       (product_code, category, image_url, image_name, mime_type, size_bytes, price, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [productCode, category, imageUrl, imageName, file.mimetype, file.size, price, description]
    );

    return res.json({ success: true, imageUrl, fileName: imageName, productCode, category, price, description });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
