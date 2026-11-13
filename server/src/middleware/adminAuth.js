export const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // In local development or initial bootstrap, allow pass-through if testing header is present or fall back gracefully
      return res.status(401).json({ success: false, error: 'Authorization header required.' });
    }

    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'Malformed authentication token.' });
    }

    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
      if (decoded.role === 'superadmin' && decoded.exp > Date.now()) {
        req.adminUser = decoded;
        return next();
      }
      return res.status(401).json({ success: false, error: 'Session expired. Please log in again.' });
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid authentication token.' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Authentication verification failure.' });
  }
};

