import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || '';

export const databaseEnabled = Boolean(connectionString);

const pool = databaseEnabled
  ? new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  : null;

export async function query(text, params = []) {
  if (!pool) {
    throw new Error('PostgreSQL database is not configured. Set DATABASE_URL before starting the server.');
  }

  return pool.query(text, params);
}

export async function healthCheck() {
  if (!pool) {
    return {
      status: 'not-configured',
      database: 'postgres',
      message: 'DATABASE_URL is not set. PostgreSQL is optional for local static fallback.',
    };
  }

  try {
    const result = await pool.query('SELECT NOW() as current_time');
    return {
      status: 'ok',
      database: 'postgres',
      connectedAt: result.rows[0].current_time,
    };
  } catch (error) {
    return {
      status: 'error',
      database: 'postgres',
      message: error.message,
    };
  }
}

export async function initializeSchema() {
  if (!pool) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS adal_products (
      id SERIAL PRIMARY KEY,
      code VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(150) NOT NULL,
      size VARCHAR(80),
      category VARCHAR(80),
      price NUMERIC(10,2) NOT NULL DEFAULT 0,
      description TEXT,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS adal_product_images (
      id SERIAL PRIMARY KEY,
      product_code VARCHAR(100),
      category VARCHAR(80) DEFAULT 'cylinder',
      image_url VARCHAR(255) NOT NULL,
      image_name VARCHAR(150),
      mime_type VARCHAR(80),
      size_bytes INTEGER,
      price NUMERIC(10,2) DEFAULT 0,
      description TEXT,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`ALTER TABLE adal_product_images ADD COLUMN IF NOT EXISTS category VARCHAR(80) DEFAULT 'cylinder';`);
  await pool.query(`ALTER TABLE adal_product_images ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0;`);
  await pool.query(`ALTER TABLE adal_product_images ADD COLUMN IF NOT EXISTS description TEXT;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS adal_orders (
      id SERIAL PRIMARY KEY,
      customer_name VARCHAR(120),
      customer_phone VARCHAR(80),
      cylinder_code VARCHAR(100) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      delivery_zone VARCHAR(120),
      status VARCHAR(40) NOT NULL DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS adal_visits (
      id SERIAL PRIMARY KEY,
      method VARCHAR(12),
      path VARCHAR(255),
      ip VARCHAR(64),
      user_agent TEXT,
      referrer VARCHAR(255),
      status_code INTEGER,
      visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
