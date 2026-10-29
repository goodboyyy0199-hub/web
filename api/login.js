// GET /login -> ส่งผู้ใช้ไปหน้าอนุญาตของ Discord
const crypto = require('crypto');
const { STATE_COOKIE, cookie } = require('../lib/session');

module.exports = (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) { res.statusCode = 500; return res.end('DISCORD_CLIENT_ID is not set'); }

  const redirectUri = process.env.DISCORD_REDIRECT_URI || `https://${req.headers.host}/callback`;
  const state = crypto.randomBytes(16).toString('hex');

  const url = new URL('https://discord.com/oauth2/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'identify');
  url.searchParams.set('state', state);
  url.searchParams.set('prompt', 'none'); // เคยอนุญาตแล้วไม่ต้องกดซ้ำ

  res.setHeader('Set-Cookie', cookie(STATE_COOKIE, state, 600));
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  res.setHeader('Location', url.toString());
  res.end();
};
