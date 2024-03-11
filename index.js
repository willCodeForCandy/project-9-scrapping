require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const { connectCloudinary } = require('./src/config/cloudinary');
const mainRouter = require('./src/api/routes/mainRouter');

const app = express();
const PORT = 3000;
connectDB();
connectCloudinary();
app.use(express.json());

app.use('/api/v1/', mainRouter);

app.use('*', (req, res) => {
  return res.status(404).json('Route not found 🦖');
});

app.listen(PORT, () => {
  console.log(`Listening loud and clear @ http://localhost:${PORT}`);
});
