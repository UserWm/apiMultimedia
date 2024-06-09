const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const trackRoutes = require('./routes/tracks');


const app = express()
const port = 3000

const mongoURI = "mongodb://localhost:27017/DBTracks"

// Middleware
app.use(bodyParser.json());
app.use('/tracks', express.static('tracks'));

//conexion con mongo
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err))

// Rutas
app.use('/api/tracks', trackRoutes);

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))