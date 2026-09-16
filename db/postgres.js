import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || '';
export const databaseEnabled = Boolean(connectionString);
const pool = databaseEnabled ? new Pool({ connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false }) : null;
export async function query(text, params = []) { if (!pool) throw new Error('PostgreSQL database is not configured. Set DATABASE_URL before starting the server.'); return pool.query(text, params); }
export async function healthCheck() { if (!pool) return { status:'not-configured', database:'postgres', message:'DATABASE_URL is not set.' }; try { const r=await pool.query('SELECT NOW() as current_time'); return {status:'ok',database:'postgres',connectedAt:r.rows[0].current_time}; } catch(e){return {status:'error',database:'postgres',message:e.message};} }
export async function initializeSchema() {
  if (!pool) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_products (id SERIAL PRIMARY KEY, code VARCHAR(100) UNIQUE NOT NULL, name VARCHAR(150) NOT NULL, size VARCHAR(80), category VARCHAR(80), price NUMERIC(10,2) NOT NULL DEFAULT 0, description TEXT, image_url VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_product_images (id SERIAL PRIMARY KEY, product_code VARCHAR(100), category VARCHAR(80) DEFAULT 'cylinder', image_url VARCHAR(255) NOT NULL, image_name VARCHAR(150), mime_type VARCHAR(80), size_bytes INTEGER, price NUMERIC(10,2) DEFAULT 0, description TEXT, uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`ALTER TABLE adal_product_images ADD COLUMN IF NOT EXISTS category VARCHAR(80) DEFAULT 'cylinder'`); await pool.query(`ALTER TABLE adal_product_images ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0`); await pool.query(`ALTER TABLE adal_product_images ADD COLUMN IF NOT EXISTS description TEXT`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_orders (id SERIAL PRIMARY KEY, customer_name VARCHAR(120), customer_phone VARCHAR(80), cylinder_code VARCHAR(100) NOT NULL, quantity INTEGER NOT NULL DEFAULT 1, delivery_zone VARCHAR(120), status VARCHAR(40) NOT NULL DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_visits (id SERIAL PRIMARY KEY, method VARCHAR(12), path VARCHAR(255), ip VARCHAR(64), user_agent TEXT, referrer VARCHAR(255), status_code INTEGER, visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_content_items (id SERIAL PRIMARY KEY, type VARCHAR(30) NOT NULL, title VARCHAR(200) NOT NULL, body TEXT DEFAULT '', image_url VARCHAR(255), metadata JSONB NOT NULL DEFAULT '{}'::jsonb, sort_order INTEGER NOT NULL DEFAULT 0, published BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_adal_content_type ON adal_content_items(type, published, sort_order)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_media (id SERIAL PRIMARY KEY, image_url VARCHAR(255) NOT NULL, image_name VARCHAR(255) NOT NULL, mime_type VARCHAR(80), size_bytes INTEGER, uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  const defaults=[['3KG','3kg Camping Cylinder','3kg','3kg',32000,'Portable LPG cylinder','/uploads/default-3kg.jpg'],['6KG','6kg Domestic Cylinder','6kg','6kg',55000,'Household LPG cylinder','/uploads/default-6kg.jpg'],['12.5KG','12.5kg Family Cylinder','12.5kg','12.5kg',90000,'Family LPG cylinder','/uploads/default-12.5kg.jpg'],['38KG','38kg Commercial Cylinder','38kg','38kg',180000,'Commercial LPG cylinder','/uploads/default-38kg.jpg'],['ACCESSORIES','Gas Accessories','accessories','accessories',0,'Gas accessories and safety equipment','/uploads/default-accessories.jpg']];
  for(const product of defaults) await pool.query(`INSERT INTO adal_products (code,name,size,category,price,description,image_url) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (code) DO NOTHING`,product);
}
