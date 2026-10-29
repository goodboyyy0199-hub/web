// GET /callback?code=...&state=... -> แลก code เป็น token, ดึงโปรไฟล์ Discord, ตั้งคุกกี้ session
// (กรณีกด "ยกเลิก" -> ?error=access_denied จะถูก redirect ไป "/" โดย vercel.json ก่อนถึงไฟล์นี้)
const { COOKIE, STATE_COOKIE, MAX_AGE, sign, parseCookies, cookie } = require('../lib/session');

function fail(res, reason) {
  console.error('LOGIN FAIL:', reason);
  res.setHeader('Set-Cookie', cookie(STATE_COOKIE, '', 0));
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  res.setHeader('Location', '/?login=error');
  res.end();
}

module.exports = async (req, res) => {
  try {
    const { code, state } = req.query || {};
    const saved = parseCookies(req)[STATE_COOKIE];
    if (!code || !state || !saved || state !== saved) {
      return fail(res, 'state check: ' + JSON.stringify({
        hasCode: !!code,
        hasState: !!state,
        hasSavedCookie: !!saved,
        match: state === saved,
      }));
    }

    const redirectUri = process.env.DISCORD_REDIRECT_URI || `https://${req.headers.host}/callback`;
    console.log('redirectUri used:', redirectUri);
    console.log('env present:', {
      id: !!process.env.DISCORD_CLIENT_ID,
      secret: !!process.env.DISCORD_CLIENT_SECRET,
      session: !!process.env.SESSION_SECRET,
    });

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: String(code),
        redirect_uri: redirectUri,
      }),
    });
    if (!tokenRes.ok) {
      return fail(res, 'token exchange ' + tokenRes.status + ' ' + (await tokenRes.text()));
    }
    const token = await tokenRes.json();

    const meRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!meRes.ok) return fail(res, 'user fetch ' + meRes.status);
    const u = await meRes.json();

    const session = sign({
      id: u.id,
      username: u.username,
      global_name: u.global_name || null,
      avatar: u.avatar || null,
      exp: Math.floor(Date.now() / 1000) + MAX_AGE,
    });

    res.setHeader('Set-Cookie', [
      cookie(COOKIE, session, MAX_AGE),
      cookie(STATE_COOKIE, '', 0),
    ]);
    res.setHeader('Cache-Control', 'no-store');
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  } catch (e) {
    fail(res, 'exception: ' + ((e && e.stack) || e));
  }
};
