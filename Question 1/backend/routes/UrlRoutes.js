const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const router = express.Router();

const isExpired = (doc) => {
  const expireTime = new Date(doc.createdAt.getTime() + doc.expiryMinutes * 60000);
  return new Date() > expireTime;
};

const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token !== process.env.BEARER_TOKEN) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
  next();
};

router.post('/shorten', validateToken, async (req, res) => {
  try {
    const { url, shortcode, expiryMinutes } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const code = shortcode || nanoid(6);
    const exists = await Url.findOne({ shortcode: code });
    if (exists) return res.status(400).json({ error: 'Shortcode already exists' });

    const newUrl = await Url.create({
      shortcode: code,
      originalUrl: url,
      expiryMinutes: expiryMinutes ? parseInt(expiryMinutes) : 30
    });

    res.json({ shortUrl: `${process.env.BASE_URL}/${code}` });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const doc = await Url.findOne({ shortcode: req.params.code });
    if (!doc) return res.status(404).json({ error: 'Shortcode not found' });

    if (isExpired(doc)) return res.status(410).json({ error: 'Link has expired' });

    res.redirect(doc.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Redirection error' });
  }
});

module.exports = router;
