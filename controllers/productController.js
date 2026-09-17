import fs from 'fs';
import path from 'path';
import { query } from '../db/postgres.js';
import { uploadDir } from '../config/upload.js';

export const defaultProducts = [
  { id: 1, code: '3KG', name: '3kg Camping Cylinder', size: '3kg', category: '3kg', price: 32000, description: 'Portable LPG cylinder', image_url: '/uploads/default-3kg.jpg' },
  { id: 2, code: '6KG', name: '6kg Domestic Cylinder', size: '6kg', category: '6kg', price: 55000, description: 'Household LPG cylinder', image_url: '/uploads/default-6kg.jpg' },
  { id: 3, code: '12.5KG', name: '12.5kg Family Cylinder', size: '12.5kg', category: '12.5kg', price: 90000, description: 'Family LPG cylinder', image_url: '/uploads/1789549049679-12-5kg.jpg' },
  { id: 4, code: '38KG', name: '38kg Commercial Cylinder', size: '38kg', category: '38kg', price: 180000, description: 'Commercial LPG cylinder', image_url: '/uploads/1789549017989-38kg.png' },
  { id: 5, code: 'ACCESSORIES', name: 'Accessories', size: 'accessories', category: 'accessories', price: 0, description: 'Gas accessories and safety kit', image_url: '/uploads/default-accessories.svg' },
];

const normalizeCode = (value) => String(value || '').trim().toUpperCase().replace(/\s+/g, '-');
const normalizeCategory = (value) => String(value || 'cylinder').trim().toLowerCase();
const getProductStore = (app) => {
  if (!app.locals.productStore) app.locals.productStore = defaultProducts.map((product) => ({ ...product }));
  return app.locals.productStore;
};

export async function getProducts(req, res) {
  try {
    if (!process.env.DATABASE_URL) return res.json(getProductStore(req.app));
    const result = await query(`
      SELECT p.id, p.code, p.name, p.size, p.category, p.price, p.description,
             COALESCE(pi.image_url, p.image_url) AS image_url, p.created_at
      FROM adal_products p
      LEFT JOIN LATERAL (
        SELECT image_url FROM adal_product_images
        WHERE product_code = p.code
        ORDER BY uploaded_at DESC, id DESC LIMIT 1
      ) pi ON true
      ORDER BY p.id ASC
    `);
    return res.json(result.rows);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function createProduct(req, res) {
  try {
    const { code, name, size, category, price, description } = req.body || {};
    const normalizedCode = normalizeCode(code || name);
    const numericPrice = Number(price);
    if (!normalizedCode || !name) return res.status(400).json({ message: 'Product code and name are required.' });
    if (!Number.isFinite(numericPrice) || numericPrice < 0) return res.status(400).json({ message: 'Price must be a valid non-negative number.' });
    const imageUrl = String(req.body.imageUrl ?? req.body.image_url ?? '').trim() || null;
    const product = { code: normalizedCode, name: String(name).trim(), size: String(size || '').trim(), category: normalizeCategory(category), price: numericPrice, description: String(description || '').trim(), image_url: imageUrl };

    if (!process.env.DATABASE_URL) {
      const store = getProductStore(req.app);
      if (store.some((item) => item.code === normalizedCode)) return res.status(409).json({ message: 'A product with this code already exists.' });
      const created = { id: Math.max(0, ...store.map((item) => Number(item.id))) + 1, ...product };
      store.push(created);
      return res.status(201).json(created);
    }
    const result = await query(`INSERT INTO adal_products (code, name, size, category, price, description, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [product.code, product.name, product.size, product.category, product.price, product.description, product.image_url]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'A product with that code already exists.' });
    return res.status(500).json({ message: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const productId = Number(req.params.id);
    const { code, name, size, category, price, description } = req.body || {};
    if (!Number.isInteger(productId)) return res.status(400).json({ message: 'Invalid product ID.' });
    if (price !== undefined && (!Number.isFinite(Number(price)) || Number(price) < 0)) return res.status(400).json({ message: 'Price must be a valid non-negative number.' });
    const imageProvided = req.body.imageUrl !== undefined || req.body.image_url !== undefined;
    const imageUrl = String(req.body.imageUrl ?? req.body.image_url ?? '').trim() || null;

    if (!process.env.DATABASE_URL) {
      const store = getProductStore(req.app);
      const product = store.find((item) => Number(item.id) === productId);
      if (!product) return res.status(404).json({ message: 'Product not found.' });
      Object.assign(product, {
        code: code !== undefined ? normalizeCode(code) : product.code,
        name: name !== undefined ? String(name).trim() : product.name,
        size: size !== undefined ? String(size).trim() : product.size,
        category: category !== undefined ? normalizeCategory(category) : product.category,
        price: price !== undefined ? Number(price) : product.price,
        description: description !== undefined ? String(description).trim() : product.description,
        image_url: imageProvided ? imageUrl : product.image_url,
      });
      return res.json(product);
    }
    const result = await query(`UPDATE adal_products SET code = COALESCE($1, code), name = COALESCE($2, name), size = COALESCE($3, size), category = COALESCE($4, category), price = COALESCE($5, price), description = COALESCE($6, description), image_url = CASE WHEN $7::boolean THEN $8 ELSE image_url END WHERE id = $9 RETURNING *`, [code !== undefined ? normalizeCode(code) : null, name !== undefined ? String(name).trim() : null, size !== undefined ? String(size).trim() : null, category !== undefined ? normalizeCategory(category) : null, price !== undefined ? Number(price) : null, description !== undefined ? String(description).trim() : null, imageProvided, imageUrl, productId]);
    if (!result.rows.length) return res.status(404).json({ message: 'Product not found.' });
    return res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'A product with that code already exists.' });
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId)) return res.status(400).json({ message: 'Invalid product ID.' });
    if (!process.env.DATABASE_URL) {
      const store = getProductStore(req.app);
      const index = store.findIndex((item) => Number(item.id) === productId);
      if (index < 0) return res.status(404).json({ message: 'Product not found.' });
      store.splice(index, 1);
      return res.json({ success: true, deletedId: productId });
    }
    const result = await query('DELETE FROM adal_products WHERE id = $1 RETURNING id', [productId]);
    if (!result.rows.length) return res.status(404).json({ message: 'Product not found.' });
    return res.json({ success: true, deletedId: productId });
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function getProductImages(req, res) {
  try {
    if (!process.env.DATABASE_URL) return res.json(req.app.locals.imageStore || []);
    const result = await query('SELECT * FROM adal_product_images ORDER BY uploaded_at DESC');
    return res.json(result.rows);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function updateProductImage(req, res) {
  try {
    const imageId = Number(req.params.id);
    const { productCode, category, imageName, price, description } = req.body || {};
    if (!Number.isInteger(imageId)) return res.status(400).json({ message: 'Invalid image ID.' });
    const normalizedProductCode = productCode ? normalizeCode(productCode) : null;
    if (!process.env.DATABASE_URL) {
      const imageStore = req.app.locals.imageStore || [];
      const image = imageStore.find((item) => Number(item.id) === imageId);
      if (!image) return res.status(404).json({ message: 'Image not found.' });
      image.product_code = normalizedProductCode || image.product_code;
      image.category = category ? normalizeCategory(category) : image.category || 'cylinder';
      image.image_name = imageName || image.image_name;
      image.price = Number(price ?? image.price ?? 0);
      image.description = description ?? image.description ?? '';
      return res.json({ success: true, updated: image });
    }
    const result = await query(`UPDATE adal_product_images SET product_code = COALESCE($1, product_code), category = COALESCE($2, category), image_name = COALESCE($3, image_name), price = COALESCE($4, price), description = COALESCE($5, description) WHERE id = $6 RETURNING *`, [normalizedProductCode, category ? normalizeCategory(category) : null, imageName, price !== undefined ? Number(price) : null, description, imageId]);
    if (!result.rows.length) return res.status(404).json({ message: 'Image not found.' });
    return res.json({ success: true, updated: result.rows[0] });
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function deleteProductImage(req, res) {
  try {
    const imageId = Number(req.params.id);
    const removeFile = (imageUrl) => { if (!imageUrl) return; const filePath = path.join(uploadDir, path.basename(imageUrl)); if (fs.existsSync(filePath)) fs.unlinkSync(filePath); };
    if (!process.env.DATABASE_URL) {
      const imageStore = req.app.locals.imageStore || [];
      const index = imageStore.findIndex((image) => Number(image.id) === imageId);
      if (index < 0) return res.status(404).json({ message: 'Image not found.' });
      removeFile(imageStore[index].image_url); imageStore.splice(index, 1); return res.json({ success: true, deletedId: imageId });
    }
    const result = await query('DELETE FROM adal_product_images WHERE id = $1 RETURNING image_url', [imageId]);
    if (!result.rows.length) return res.status(404).json({ message: 'Image not found.' });
    removeFile(result.rows[0].image_url); return res.json({ success: true, deletedId: imageId });
  } catch (error) { return res.status(500).json({ message: error.message }); }
}

export async function uploadImage(req, res) {
  try {
    const productCode = normalizeCode(req.body.productCode || 'ACCESSORIES');
    const category = normalizeCategory(req.body.category || 'cylinder');
    const imageName = String(req.body.imageName || req.file?.originalname || 'Uploaded image');
    const price = Number(req.body.price || 0);
    const description = String(req.body.description || '');
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No image file provided.' });
    if (!Number.isFinite(price) || price < 0) return res.status(400).json({ message: 'Price must be a valid non-negative number.' });
    const imageUrl = `/uploads/${file.filename}`;

    if (!process.env.DATABASE_URL) {
      const imageStore = req.app.locals.imageStore || [];
      const image = { id: req.app.locals.imageStoreSequence++, product_code: productCode, category, image_url: imageUrl, image_name: imageName, mime_type: file.mimetype, size_bytes: file.size, uploaded_at: new Date().toISOString(), price, description };
      imageStore.push(image);
      const store = getProductStore(req.app);
      const existing = store.find((item) => item.code === productCode);
      if (existing) Object.assign(existing, { image_url: imageUrl, price: price > 0 ? price : existing.price, description: description || existing.description });
      return res.status(201).json({ success: true, ...image, product_updated: Boolean(existing) });
    }

    const result = await query(`INSERT INTO adal_product_images (product_code, category, image_url, image_name, mime_type, size_bytes, price, description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [productCode, category, imageUrl, imageName, file.mimetype, file.size, price, description]);
    const image = result.rows[0];
    const productResult = await query(`UPDATE adal_products SET image_url = $1, price = CASE WHEN $2::numeric > 0 THEN $2 ELSE price END, description = CASE WHEN $3 <> '' THEN $3 ELSE description END WHERE code = $4 RETURNING id, code, name, size, category, price, description, image_url`, [imageUrl, price, description, productCode]);
    return res.status(201).json({ success: true, ...image, product_updated: productResult.rowCount > 0, product: productResult.rows[0] || null });
  } catch (error) { return res.status(500).json({ message: error.message }); }
}
