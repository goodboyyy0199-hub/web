// GET /api/status -> { players } จำนวนผู้เล่นออนไลน์จริงจาก Roblox
const PLACE_ID = process.env.ROBLOX_PLACE_ID || '140583889607592';
let universeId = process.env.ROBLOX_UNIVERSE_ID || null;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30'); // ให้ CDN แคชไว้ ลดการยิง Roblox
  try {
    if (!universeId) {
      const r = await fetch(`https://apis.roblox.com/universes/v1/places/${PLACE_ID}/universe`);
      if (!r.ok) throw new Error('universe lookup ' + r.status);
      universeId = String((await r.json()).universeId);
    }
    const g = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
    if (!g.ok) throw new Error('games api ' + g.status);
    const d = await g.json();
    const players = d && d.data && d.data[0] ? d.data[0].playing : null;
    if (typeof players !== 'number') throw new Error('no player count');
    res.json({ players });
  } catch (e) {
    console.error('status error:', e);
    res.statusCode = 502;
    res.json({ error: 'unavailable' });
  }
};
