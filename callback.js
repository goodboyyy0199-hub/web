const { sign, verify, parseCookies, cookie, redirectUri, avatarUrl } = require('./_lib');

module.exports = async (req, res) => {
  const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, SESSION_SECRET } = process.env;
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !SESSION_SECRET) {
    return res.status(500).send('ยังไม่ได้ตั้งค่า Environment Variables บน Vercel');
  }

  const { code, state, error } = req.query;
  if (error) return res.redirect(302, '/?error=denied');

  const saved = verify(parseCookies(req).oauth_state);
  if (!code || !state || !saved || saved.state !== state) {
    return res.status(400).send('state ไม่ถูกต้องหรือหมดอายุ กลับไปล็อคอินใหม่อีกครั้ง');
  }

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: String(code),
        redirect_uri: redirectUri(req),
      }),
    });
    const token = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(token.error_description || token.error || 'token error');

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const user = await userRes.json();
    if (!userRes.ok) throw new Error('ดึงข้อมูลผู้ใช้ไม่สำเร็จ');

    const week = 7 * 24 * 60 * 60;
    const session = sign({
      id: user.id,
      username: user.username,
      globalName: user.global_name || null,
      email: user.email || null,
      avatar: avatarUrl(user),
      exp: Date.now() + week * 1000,
    });

    res.setHeader('Set-Cookie', [
      cookie('session', session, week),
      cookie('oauth_state', '', 0),
    ]);
    res.redirect(302, '/dashboard');
  } catch (e) {
    console.error('OAuth error:', e.message);
    res.redirect(302, '/?error=failed');
  }
};
