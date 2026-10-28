const crypto = require('crypto');
const { sign, cookie, redirectUri } = require('./_lib');

module.exports = (req, res) => {
  const { DISCORD_CLIENT_ID, SESSION_SECRET } = process.env;
  if (!DISCORD_CLIENT_ID || !SESSION_SECRET) {
    return res.status(500).send('ยังไม่ได้ตั้งค่า Environment Variables บน Vercel (DISCORD_CLIENT_ID, SESSION_SECRET)');
  }

  const state = crypto.randomBytes(16).toString('hex');
  const stateCookie = sign({ state, exp: Date.now() + 10 * 60 * 1000 });

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri(req),
    scope: 'identify email',
    state,
    prompt: 'none',
  });

  res.setHeader('Set-Cookie', cookie('oauth_state', stateCookie, 600));
  res.redirect(302, `https://discord.com/oauth2/authorize?${params}`);
};
