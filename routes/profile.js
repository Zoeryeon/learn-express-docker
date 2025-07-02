// routes/profile.js
const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  if (req.session.user) {
    res.send(`환영합니다, ${req.session.user.name}님!`);
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
});

module.exports = router;
