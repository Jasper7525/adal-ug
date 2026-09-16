export function requireAdmin(req, res, next) {
  const adminSessions = req.app.locals.adminSessions;
  const incomingToken =
    req.headers['x-admin-token'] ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!incomingToken || !adminSessions?.has(incomingToken)) {
    return res.status(401).json({
      message: 'Admin authentication required.',
    });
  }

  next();
}
