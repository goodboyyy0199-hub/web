// GET /api/me -> { user } ถ้าล็อกอินอยู่, 401 ถ้าไม่
const { getUser } = require('../lib/session');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  let u = null;
  try { u = getUser(req); } catch (e) { console.error(e); }
  if (!u) { res.statusCode = 401; return res.json({ error: 'unauthorized' }); }
  res.json({ user: { id: u.id, username: u.username, global_name: u.global_name, avatar: u.avatar } });
};
