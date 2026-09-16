const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export function requireAdmin(req, res, next) {
  const adminSessions = req.app.locals.adminSessions;
  const incomingToken = req.headers['x-admin-token'] || req.headers.authorization?.replace('Bearer ', '');
  const session = incomingToken ? adminSessions?.get(incomingToken) : null;

  if (!session) return res.status(401).json({ message: 'Admin authentication required.' });
  if (!session.issuedAt || Date.now() - session.issuedAt > SESSION_TTL_MS) {
    adminSessions.delete(incomingToken);
    return res.status(401).json({ message: 'Admin session expired. Please log in again.' });
  }
  req.admin = session;
  next();
}
