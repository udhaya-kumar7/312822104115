const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const urlRoutes = require('./routes/UrlRoutes');
const logger = require('./middleware/logger');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/api/url', urlRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('MongoDB Error:', err));
