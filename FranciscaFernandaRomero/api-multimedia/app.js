const express = require('express');
const mongoose = require('mongoose');
const trackRoutes = require('./routes/trackRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use('/tracks', express.static(path.join(__dirname, 'tracks')));

app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api', trackRoutes);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/multimedia', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
