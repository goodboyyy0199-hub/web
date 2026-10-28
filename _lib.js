const crypto = require('crypto');

const SECRET = process.env.SESSION_SECRET || '';

function b64(s) {
  return Buffer.from(s).toString('base64url');
}

function sign(payload) {
  const body = b64(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token || !SECRET) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expect = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (data.exp && Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > -1) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

function cookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function redirectUri(req) {
  if (process.env.REDIRECT_URI) return process.env.REDIRECT_URI;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `https://${host}/auth/callback`;
}

function avatarUrl(u) {
  if (u.avatar) {
    const ext = u.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${ext}?size=256`;
  }
  return `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(u.id) >> 22n) % 6n)}.png`;
}

module.exports = { sign, verify, parseCookies, cookie, redirectUri, avatarUrl };
