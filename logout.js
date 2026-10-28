const { cookie } = require('./_lib');

module.exports = (req, res) => {
  res.setHeader('Set-Cookie', cookie('session', '', 0));
  res.redirect(302, '/');
};
