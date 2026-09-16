import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';

dotenv.config();

const ADMIN_KEY = process.env.ADMIN_KEY || 'adal-ug-admin-key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const { healthCheck, initializeSchema, query } = await import('./db/postgres.js');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const uploadDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
const adminSessions = new Map();
const visitorStore = [];
const imageStore = [];
let imageStoreSequence = 1;

app.use(express.json({ limit: '5mb' }));

app.use((req, _res, next) => {
  req.visitor = {
    method: req.method,
    path: req.path,
    ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    referrer: req.headers.referer || 'direct',
  };
  next();
});

app.use((req, res, next) => {
  res.on('finish', () => {
    const path = req.path || req.originalUrl || req.url;
    if (!path.startsWith('/api/admin')) {
      const payload = {
        method: req.method,
        path,
        ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
        user_agent: req.headers['user-agent'] || 'unknown',
        referrer: req.headers.referer || 'direct',
        status_code: res.statusCode,
        visited_at: new Date().toISOString(),
      };

      if (process.env.DATABASE_URL) {
        query(
          `INSERT INTO adal_visits (method, path, ip, user_agent, referrer, status_code, visited_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [payload.method, payload.path, payload.ip, payload.user_agent, payload.referrer, payload.status_code, payload.visited_at]
        ).catch(() => {});
      } else {
        visitorStore.push(payload);
      }
    }
  });

  next();
});

const requireAdmin = (req, res, next) => {
  const incomingToken = req.headers['x-admin-token'] || req.headers.authorization?.replace('Bearer ', '');
  if (!incomingToken || !adminSessions.has(incomingToken)) {
    return res.status(401).json({ message: 'Admin authentication required.' });
  }

  return next();
};

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = randomBytes(24).toString('hex');
    adminSessions.set(token, { username, issuedAt: new Date().toISOString() });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ message: 'Invalid admin credentials.' });
});

app.get('/api/admin/visitors', requireAdmin, async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(visitorStore.slice(0, 100));
    }

    const result = await query(
      `SELECT id, method, path, ip, user_agent, referrer, status_code, visited_at
       FROM adal_visits
       ORDER BY visited_at DESC
       LIMIT 100`
    );

    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get('/api/health', async (req, res) => {
  const database = await healthCheck();

  res.json({
    status: 'ok',
    service: 'adal-ug-api',
    timestamp: new Date().toISOString(),
    database,
  });
});

app.get('/api/requirements', (req, res) => {
  res.json({
    title: 'Adal Uganda User Requirements Document',
    version: '1.0',
    format: 'HTML',
    downloadUrl: '/docs/adal-uganda-user-requirements-document.html',
  });
});

app.get('/api/products', async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json([
        { id: 1, code: '3KG', name: '3kg Camping Cylinder', size: '3kg', category: '3kg', price: 32000, description: 'Portable LPG cylinder', image_url: '/uploads/default-3kg.jpg' },
        { id: 2, code: '6KG', name: '6kg Domestic Cylinder', size: '6kg', category: '6kg', price: 55000, description: 'Household LPG cylinder', image_url: '/uploads/default-6kg.jpg' },
        { id: 3, code: '12.5KG', name: '12.5kg Family Cylinder', size: '12.5kg', category: '12.5kg', price: 90000, description: 'Family LPG cylinder', image_url: '/uploads/default-12.5kg.jpg' },
        { id: 4, code: '38KG', name: '38kg Commercial Cylinder', size: '38kg', category: '38kg', price: 180000, description: 'Commercial LPG cylinder', image_url: '/uploads/default-38kg.jpg' },
        { id: 5, code: 'ACCESSORIES', name: 'Accessories', size: 'accessories', category: 'accessories', price: 0, description: 'Gas accessories and safety kit', image_url: '/uploads/default-accessories.jpg' },
      ]);
    }

    const result = await query(`
      SELECT
        p.id,
        p.code,
        p.name,
        p.size,
        p.category,
        p.price,
        p.description,
        p.image_url,
        COALESCE(pi.image_url, p.image_url) AS image_url_from_db,
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

    const rows = result.rows.map(row => ({
      ...row,
      image_url: row.image_url_from_db || row.image_url,
    }));

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/product-images', async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(imageStore.length > 0 ? imageStore : [
        { id: 1, product_code: '3KG', image_url: '/uploads/default-3kg.jpg', image_name: '3kg Cylinder', mime_type: 'image/jpeg', size_bytes: 0, category: 'cylinder', price: 32000, description: '3kg cylinder image' },
      ]);
    }

    const result = await query('SELECT * FROM adal_product_images ORDER BY uploaded_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/product-images/:id', requireAdmin, async (req, res) => {
  try {
    const imageId = Number(req.params.id);
    const { productCode, category, imageName, price, description } = req.body || {};

    if (!process.env.DATABASE_URL) {
      const image = imageStore.find((item) => item.id === imageId);
      if (!image) {
        return res.status(404).json({ message: 'Image not found.' });
      }

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

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    return res.json({ success: true, updated: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.delete('/api/product-images/:id', requireAdmin, async (req, res) => {
  try {
    const imageId = Number(req.params.id);

    if (!process.env.DATABASE_URL) {
      const index = imageStore.findIndex((image) => Number(image.id) === imageId);
      if (index >= 0) {
        const fileName = path.basename(imageStore[index].image_url);
        const filePath = path.join(uploadDir, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        imageStore.splice(index, 1);
      }
      return res.json({ success: true, deletedId: imageId });
    }

    const result = await query(
      `DELETE FROM adal_product_images WHERE id = $1 RETURNING image_url, image_name`,
      [imageId]
    );

    if (result.rows.length > 0) {
      const fileName = path.basename(result.rows[0].image_url);
      const filePath = path.join(uploadDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return res.json({ success: true, deletedId: imageId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post('/api/upload-image', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const productCode = String(req.body.productCode || 'ACCESSORIES').toUpperCase();
    const category = String(req.body.category || 'cylinder').toLowerCase();
    const imageName = String(req.body.imageName || req.file?.originalname || 'Uploaded image');
    const price = Number(req.body.price || 0);
    const description = String(req.body.description || '');
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    const imageUrl = `/uploads/${file.filename}`;

    if (!process.env.DATABASE_URL) {
      const image = {
        id: imageStoreSequence++,
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
      `INSERT INTO adal_product_images (product_code, category, image_url, image_name, mime_type, size_bytes, price, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [productCode, category, imageUrl, imageName, file.mimetype, file.size, price, description]
    );

    return res.json({ success: true, imageUrl, fileName: imageName, productCode, category, price, description });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const { customerName, customerPhone, cylinderCode, quantity, deliveryZone } = req.body;

  try {
    if (!process.env.DATABASE_URL) {
      return res.json({
        success: true,
        message: 'Order accepted in demo mode. Configure PostgreSQL to persist orders.',
        order: {
          customerName,
          customerPhone,
          cylinderCode,
          quantity,
          deliveryZone,
          status: 'new',
        },
      });
    }

    await query(
      `INSERT INTO adal_orders (customer_name, customer_phone, cylinder_code, quantity, delivery_zone, status)
       VALUES ($1, $2, $3, $4, $5, 'new')`,
      [customerName, customerPhone, cylinderCode, quantity, deliveryZone]
    );

    res.json({ success: true, message: 'Order saved to PostgreSQL database.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use((error, req, res, next) => {
  if (error && error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON request body.' });
  }

  return next(error);
});

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/docs', express.static(path.join(__dirname, 'public', 'docs')));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

initializeSchema().catch((error) => {
  console.log('PostgreSQL initialization skipped or failed:', error.message);
});

app.listen(PORT, () => {
  console.log(`Adal Uganda Express server running on http://localhost:${PORT}`);
});
