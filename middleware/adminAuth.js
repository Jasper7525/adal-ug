import { createHash } from 'crypto';
import { query } from '../db/postgres.js';

function hashToken(token) { return createHash('sha256').update(token).digest('hex'); }

export async function requireAdmin(req, res, next) {
  try {
    const incomingToken = req.cookies?.adal_admin_session || req.headers['x-admin-token'] || req.headers.authorization?.replace('Bearer ', '');
    if (!incomingToken) return res.status(401).json({ message: 'Admin authentication required.' });
    const result = await query(`SELECT username, expires_at FROM adal_admin_sessions WHERE token_hash = $1 AND expires_at > CURRENT_TIMESTAMP LIMIT 1`, [hashToken(incomingToken)]);
    const session = result.rows[0];
    if (!session) {
      if (req.cookies?.adal_admin_session) res.clearCookie('adal_admin_session', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
      return res.status(401).json({ message: 'Admin session expired. Please sign in again.' });
    }
    req.admin = session;
    next();
  } catch (error) {
    console.error('Admin authentication failed:', error);
    return res.status(503).json({ message: 'Admin authentication service is unavailable.' });
  }
}
