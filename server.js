const express = require('express');
const app = express();
require('dotenv').config();
const profileRoutes = require('./routes/profiles');

app.use(express.json());
app.use('/profiles', profileRoutes);

app.listen(3000, () => {
  console.log('COLOSSALTV backend running on port 3000');
});
