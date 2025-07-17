const Url = require('../models/Url');
const axios = require('axios');

exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  try {
    const response = await axios.post(
      'https://example-external-api.com/shorten', // replace with actual API
      { url: originalUrl },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const shortUrl = response.data.shortUrl || response.data.data?.shortUrl;
    const url = new Url({ originalUrl, shortUrl });
    await url.save();

    res.json({ shortUrl });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
};
