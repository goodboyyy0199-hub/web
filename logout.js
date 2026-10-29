// POST /api/logout -> ล้างคุกกี้ session
const { COOKIE, cookie } = require('../lib/session');

module.exports = (req, res) => {
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Allow', 'POST'); return res.end(); }
  res.setHeader('Set-Cookie', cookie(COOKIE, '', 0));
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 204;
  res.end();
};
