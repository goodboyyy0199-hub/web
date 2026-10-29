// ตัวช่วยจัดการ session แบบ stateless (คุกกี้ลงลายเซ็น HMAC) — ไม่ต้องใช้ฐานข้อมูล
const crypto = require('crypto');

const COOKIE = 'porbox_session';
const STATE_COOKIE = 'porbox_oauth_state';
const MAX_AGE = 90 * 24 * 3600; // 90 วัน (ตรงกับฝั่งหน้าเว็บ)

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error('SESSION_SECRET is missing or too short');
  return s;
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  return body + '.' + sig;
}

function verify(token) {
  if (!token || typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!p.exp || Date.now() / 1000 > p.exp) return null;
    return p;
  } catch (e) { return null; }
}

function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i < 0) return;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function cookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

function getUser(req) {
  return verify(parseCookies(req)[COOKIE]);
}

module.exports = { COOKIE, STATE_COOKIE, MAX_AGE, sign, verify, parseCookies, cookie, getUser };
