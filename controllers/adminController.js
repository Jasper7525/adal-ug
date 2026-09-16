import { randomBytes } from 'crypto';
import { query } from '../db/postgres.js';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function login(req, res) {
  const { username, password } = req.body || {};

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = randomBytes(24).toString('hex');
    req.app.locals.adminSessions.set(token, {
      username,
      issuedAt: new Date().toISOString(),
    });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ message: 'Invalid admin credentials.' });
}

export async function getVisitors(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json((req.app.locals.visitorStore || []).slice(0, 100));
    }

    const result = await query(`
      SELECT id, method, path, ip, user_agent, referrer, status_code, visited_at
      FROM adal_visits
      ORDER BY visited_at DESC
      LIMIT 100
    `);

    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
