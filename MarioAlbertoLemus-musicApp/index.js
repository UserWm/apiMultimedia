const express = require('express')
const tracksRoutes = require('./routes/tracks.js')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()
const app = express()
const port = 3000

mongoose.connect(process.env.CONNECTION_URI)
.then(_ => console.log('MongoDB connected'))
.catch(error => console.log('MongoDB is in troubles please check: ', error))

app.use('/uploads/tracks', express.static(path.join(__dirname, 'uploads/tracks')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.use('/api/tracks', tracksRoutes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))