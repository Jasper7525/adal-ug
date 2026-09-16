import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import './db/postgres.js';
import { initializeSchema, query } from './db/postgres.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import systemRoutes from './routes/systemRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const uploadDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.locals.adminSessions = new Map();
app.locals.visitorStore = [];
app.locals.imageStore = [];
app.locals.imageStoreSequence = 1;

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
    const requestPath = req.path || req.originalUrl || req.url;

    if (!requestPath.startsWith('/api/admin')) {
      const payload = {
        method: req.method,
        path: requestPath,
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
        req.app.locals.visitorStore.push(payload);
      }
    }
  });

  next();
});

app.use('/api/admin', adminRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', systemRoutes);

app.use((error, req, res, next) => {
  if (error && error.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Invalid JSON request body.',
    });
  }

  return next(error);
});

app.use('/uploads', express.static(uploadDir));
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
