const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const urlRoutes = require('./routes/UrlRoutes');
const logger = require('./middleware/logger');
const Url = require('./models/Url'); // ✅ import the model for redirect

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/api/url', urlRoutes);

// ✅ Redirect Route for Short URL
app.get('/:code', async (req, res) => {
  try {
    const doc = await Url.findOne({ shortcode: req.params.code });

    if (!doc) return res.status(404).send('Short URL not found');

    // Check expiry
    const createdAt = doc.createdAt;
    const expiresAt = new Date(createdAt.getTime() + doc.expiryMinutes * 60000);
    if (new Date() > expiresAt) {
      return res.status(410).send('Short URL expired');
    }

    // Redirect to original URL
    return res.redirect(doc.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('MongoDB Error:', err));
