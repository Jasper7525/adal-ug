import { randomBytes } from 'crypto';
import { query } from '../db/postgres.js';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export async function login(req, res) {
  try {
    const { username, password } = req.body || {};
    const configuredUsername = process.env.ADMIN_USERNAME;
    const configuredPassword = process.env.ADMIN_PASSWORD;

    if (process.env.NODE_ENV === 'production' && (!configuredUsername || !configuredPassword)) {
      return res.status(503).json({
        success: false,
        message: 'Administrator credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in the production environment.'
      });
    }

    const adminUsername = configuredUsername || 'admin';
    const adminPassword = configuredPassword || 'admin123';

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    if (!req.app.locals.adminSessions) req.app.locals.adminSessions = new Map();

    const token = randomBytes(32).toString('hex');
    req.app.locals.adminSessions.set(token, {
      username: adminUsername,
      issuedAt: Date.now()
    });

    return res.json({ success: true, token, expiresIn: SESSION_TTL_MS });
  } catch (error) {
    console.error('Admin login failed:', error);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production'
        ? 'Administrator login failed on the server. Check the deployment logs.'
        : error?.message || 'Administrator login failed.'
    });
  }
}

export async function getVisitors(req, res) {
  try {
    if (!process.env.DATABASE_URL) return res.json((req.app.locals.visitorStore || []).slice(0, 200));
    const result = await query(`SELECT id, method, path, ip, user_agent, referrer, status_code, visited_at FROM adal_visits ORDER BY visited_at DESC LIMIT 200`);
    return res.json(result.rows);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}
