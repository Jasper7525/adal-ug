import 'dotenv/config';
import pg from 'pg';
import { randomBytes, scryptSync } from 'crypto';
const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || '';
export const databaseEnabled = Boolean(connectionString);
const pool = databaseEnabled ? new Pool({
  connectionString,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
}) : null;
export async function query(text, params = []) { if (!pool) throw new Error('PostgreSQL database is not configured. Set DATABASE_URL before starting the server.'); return pool.query(text, params); }
export async function healthCheck() { if (!pool) return { status:'not-configured', database:'postgres', message:'DATABASE_URL is not set.' }; try { const r=await pool.query('SELECT NOW() as current_time'); return {status:'ok',database:'postgres',connectedAt:r.rows[0].current_time}; } catch(e){return {status:'error',database:'postgres',message:e.message};} }
export function hashAdminPassword(password) { const salt = randomBytes(16).toString('hex'); const hash = scryptSync(password, salt, 64).toString('hex'); return `scrypt$${salt}$${hash}`; }
function strongPassword(password) { return typeof password === 'string' && password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password); }
export async function initializeSchema() {
  if (!pool) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_admin_credentials (id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), username VARCHAR(150) NOT NULL, password_hash TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_admin_sessions (id BIGSERIAL PRIMARY KEY, token_hash VARCHAR(128) UNIQUE NOT NULL, username VARCHAR(150) NOT NULL, expires_at TIMESTAMP NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_adal_admin_sessions_expiry ON adal_admin_sessions(expires_at)`);
  const credentialCount = await pool.query(`SELECT COUNT(*)::int AS count FROM adal_admin_credentials`);
  if (credentialCount.rows[0].count === 0 && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
    if (!strongPassword(process.env.ADMIN_PASSWORD)) throw new Error('ADMIN_PASSWORD must be at least 12 characters and include uppercase, lowercase, number and symbol.');
    await pool.query(`INSERT INTO adal_admin_credentials (id, username, password_hash) VALUES (1, $1, $2) ON CONFLICT (id) DO NOTHING`, [process.env.ADMIN_USERNAME, hashAdminPassword(process.env.ADMIN_PASSWORD)]);
  }
  await pool.query(`DELETE FROM adal_admin_sessions WHERE expires_at < CURRENT_TIMESTAMP`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_products (id SERIAL PRIMARY KEY, code VARCHAR(100) UNIQUE NOT NULL, name VARCHAR(150) NOT NULL, size VARCHAR(80), category VARCHAR(80), price NUMERIC(10,2) NOT NULL DEFAULT 0, description TEXT, image_url VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_product_images (id SERIAL PRIMARY KEY, product_code VARCHAR(100), category VARCHAR(80) DEFAULT 'cylinder', image_url VARCHAR(255) NOT NULL, image_name VARCHAR(150), mime_type VARCHAR(80), size_bytes INTEGER, price NUMERIC(10,2) DEFAULT 0, description TEXT, uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`ALTER TABLE adal_product_images ADD COLUMN IF NOT EXISTS category VARCHAR(80) DEFAULT 'cylinder'`); await pool.query(`ALTER TABLE adal_product_images ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0`); await pool.query(`ALTER TABLE adal_product_images ADD COLUMN IF NOT EXISTS description TEXT`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_orders (id SERIAL PRIMARY KEY, customer_name VARCHAR(120), customer_phone VARCHAR(80), cylinder_code VARCHAR(100) NOT NULL, quantity INTEGER NOT NULL DEFAULT 1, delivery_zone VARCHAR(120), status VARCHAR(40) NOT NULL DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_visits (id SERIAL PRIMARY KEY, method VARCHAR(12), path VARCHAR(255), ip VARCHAR(64), user_agent TEXT, referrer VARCHAR(255), status_code INTEGER, visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS adal_content_items (id SERIAL PRIMARY KEY, type VARCHAR(30) NOT NULL, title VARCHAR(200) NOT NULL, body TEXT DEFAULT '', image_url VARCHAR(255), metadata JSONB NOT NULL DEFAULT '{}'::jsonb, sort_order INTEGER NOT NULL DEFAULT 0, published BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_adal_content_type ON adal_content_items(type, published, sort_order)`);
  const partnerDefaults=[
    ['partner','NATGAS Uganda','LPG logistics, distribution and technical services in Uganda.','https://natgasuganda.com/wp-content/uploads/2022/06/NATGAS-LOGO.jpg',1],
    ['partner','TotalEnergies Uganda','Energy partner and LPG brand operating in Uganda.','https://cdn.greatugandajobs.com/jsjobsdata/data/employer/comp_7464/logo/totalenergies-logo-png_seeklogo-405344.png',2]
  ];
  for(const [type,title,body,image_url,sort_order] of partnerDefaults) await pool.query(`INSERT INTO adal_content_items(type,title,body,image_url,sort_order,published) SELECT $1,$2,$3,$4,$5,TRUE WHERE NOT EXISTS (SELECT 1 FROM adal_content_items WHERE type=$1 AND title=$2)`,[type,title,body,image_url,sort_order]);

  await pool.query(`CREATE TABLE IF NOT EXISTS adal_media (id SERIAL PRIMARY KEY, image_url VARCHAR(255) NOT NULL, image_name VARCHAR(255) NOT NULL, mime_type VARCHAR(80), size_bytes INTEGER, image_data BYTEA, uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`ALTER TABLE adal_media ADD COLUMN IF NOT EXISTS image_data BYTEA`);
  const defaults=[['3KG','3kg Camping Cylinder','3kg','3kg',32000,'Portable LPG cylinder','/uploads/default-3kg.jpg'],['6KG','6kg Domestic Cylinder','6kg','6kg',55000,'Household LPG cylinder','/uploads/default-6kg.jpg'],['12.5KG','12.5kg Family Cylinder','12.5kg','12.5kg',90000,'Family LPG cylinder','/uploads/1789549049679-12-5kg.jpg'],['38KG','38kg Commercial Cylinder','38kg','38kg',180000,'Commercial LPG cylinder','/uploads/1789549017989-38kg.png'],['ACCESSORIES','Gas Accessories','accessories','accessories',0,'Gas accessories and safety equipment','/uploads/default-accessories.svg']];
  for(const product of defaults) await pool.query(`INSERT INTO adal_products (code,name,size,category,price,description,image_url) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (code) DO NOTHING`,product);
  await pool.query(`UPDATE adal_products SET image_url='/uploads/1789549049679-12-5kg.jpg' WHERE code='12.5KG' AND (image_url IS NULL OR image_url='/uploads/default-12.5kg.jpg')`);
  await pool.query(`UPDATE adal_products SET image_url='/uploads/1789549017989-38kg.png' WHERE code='38KG' AND (image_url IS NULL OR image_url='/uploads/default-38kg.png')`);
  await pool.query(`UPDATE adal_products SET image_url='/uploads/default-accessories.svg' WHERE code='ACCESSORIES' AND (image_url IS NULL OR image_url='/uploads/default-accessories.jpg')`);
}
