import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { query, hashAdminPassword } from '../db/postgres.js';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 12;
function hashToken(token) { return createHash('sha256').update(token).digest('hex'); }
function verifyPassword(password, stored) { if (!stored?.startsWith('scrypt$')) return false; const [, salt, expectedHex] = stored.split('$'); if (!salt || !expectedHex) return false; const actual = scryptSync(password, salt, 64); const expected = Buffer.from(expectedHex, 'hex'); return expected.length === actual.length && timingSafeEqual(actual, expected); }
function passwordIsStrong(password) { return typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password); }
function secureCookieOptions() { return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' }; }

export async function login(req, res) {
  try {
    const { username, password, rememberMe = true } = req.body || {};
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required.' });
    const result = await query(`SELECT username, password_hash FROM adal_admin_credentials WHERE id = 1 LIMIT 1`);
    const credential = result.rows[0];
    if (!credential || username.trim() !== credential.username || !verifyPassword(password, credential.password_hash)) return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    const token = randomBytes(32).toString('hex');
    const maxAge = rememberMe ? SESSION_TTL_MS : 8 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + maxAge);
    await query(`DELETE FROM adal_admin_sessions WHERE expires_at < CURRENT_TIMESTAMP`);
    await query(`INSERT INTO adal_admin_sessions (token_hash, username, expires_at) VALUES ($1,$2,$3)`, [hashToken(token), credential.username, expiresAt]);
    res.cookie('adal_admin_session', token, { ...secureCookieOptions(), maxAge });
    return res.json({ success: true, token, expiresAt: expiresAt.toISOString() });
  } catch (error) { console.error('Admin login failed:', error); return res.status(500).json({ success: false, message: 'Administrator login failed on the server. Check the deployment logs.' }); }
}

export async function getSession(req, res) {
  try {
    const currentToken = req.cookies?.adal_admin_session;
    if (!currentToken) return res.status(401).json({ authenticated: false });
    const result = await query(`SELECT username, expires_at FROM adal_admin_sessions WHERE token_hash = $1 AND expires_at > CURRENT_TIMESTAMP LIMIT 1`, [hashToken(currentToken)]);
    const session = result.rows[0];
    if (!session) {
      res.clearCookie('adal_admin_session', secureCookieOptions());
      return res.status(401).json({ authenticated: false });
    }
    const token = randomBytes(32).toString('hex');
    await query(`DELETE FROM adal_admin_sessions WHERE token_hash = $1`, [hashToken(currentToken)]);
    await query(`INSERT INTO adal_admin_sessions (token_hash, username, expires_at) VALUES ($1,$2,$3)`, [hashToken(token), session.username, session.expires_at]);
    const remainingMs = Math.max(1000, new Date(session.expires_at).getTime() - Date.now());
    res.cookie('adal_admin_session', token, { ...secureCookieOptions(), maxAge: remainingMs });
    return res.json({ authenticated: true, token, username: session.username, expiresAt: session.expires_at });
  } catch (error) {
    console.error('Admin session check failed:', error);
    return res.status(500).json({ authenticated: false, message: 'Unable to verify administrator session.' });
  }
}

export async function logout(req, res) {
  try { const token = req.cookies?.adal_admin_session || req.headers['x-admin-token']; if (token) await query(`DELETE FROM adal_admin_sessions WHERE token_hash = $1`, [hashToken(token)]); } catch (error) { console.error('Admin logout failed:', error); }
  res.clearCookie('adal_admin_session', secureCookieOptions());
  return res.json({ success: true });
}

export async function resetPassword(req, res) {
  try {
    const { resetToken, newPassword } = req.body || {};
    if (!passwordIsStrong(newPassword)) return res.status(400).json({ success: false, message: 'Password must be at least 12 characters and include uppercase, lowercase, number and symbol.' });
    if (!resetToken || !process.env.ADMIN_RESET_TOKEN) return res.status(400).json({ success: false, message: 'Password reset is not configured.' });
    const supplied = Buffer.from(resetToken); const configured = Buffer.from(process.env.ADMIN_RESET_TOKEN);
    if (supplied.length !== configured.length || !timingSafeEqual(supplied, configured)) return res.status(401).json({ success: false, message: 'Invalid password reset token.' });
    await query(`UPDATE adal_admin_credentials SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = 1`, [hashAdminPassword(newPassword)]);
    await query(`DELETE FROM adal_admin_sessions`);
    return res.json({ success: true, message: 'Administrator password reset successfully. All previous sessions were signed out.' });
  } catch (error) { console.error('Admin password reset failed:', error); return res.status(500).json({ success: false, message: 'Password reset failed on the server.' }); }
}

export async function getVisitors(req, res) {
  try { const result = await query(`SELECT id, method, path, ip, user_agent, referrer, status_code, visited_at FROM adal_visits ORDER BY visited_at DESC LIMIT 200`); return res.json(result.rows); } catch (error) { return res.status(500).json({ message: error.message }); }
}
