import { randomBytes } from 'crypto';
import { query } from '../db/postgres.js';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DEFAULT_CREDENTIALS = ADMIN_USERNAME === 'admin' && ADMIN_PASSWORD === 'admin123';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export async function login(req, res) {
  const { username, password } = req.body || {};
  if (process.env.NODE_ENV === 'production' && DEFAULT_CREDENTIALS) {
    return res.status(503).json({ message: 'Administrator credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in the production environment.' });
  }
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = randomBytes(32).toString('hex');
    req.app.locals.adminSessions.set(token, { username, issuedAt: Date.now() });
    return res.json({ success: true, token, expiresIn: SESSION_TTL_MS });
  }
  return res.status(401).json({ message: 'Invalid administrator credentials.' });
}

export async function getVisitors(req, res) {
  try {
    if (!process.env.DATABASE_URL) return res.json((req.app.locals.visitorStore || []).slice(0, 200));
    const result = await query(`SELECT id, method, path, ip, user_agent, referrer, status_code, visited_at FROM adal_visits ORDER BY visited_at DESC LIMIT 200`);
    return res.json(result.rows);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}
