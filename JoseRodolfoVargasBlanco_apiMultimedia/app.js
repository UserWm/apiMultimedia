const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path'); // Cambiado a minúsculas para seguir el estándar

const app = express();
const port = 3000;

// Middlewares
app.use(bodyParser.json());

// Configuración de rutas estáticas
app.use('/tracks', express.static(path.join(__dirname, 'tracks')));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
const mongoURI = "mongodb://localhost:27017/dbMedia";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }) // Añadido opciones para evitar advertencias
  .then(() => console.log("MongoDB Ready"))
  .catch((err) => console.log(err));

// Rutas
const rutaMedias = require("./rutas/trackMedia");
app.use("/api/trackMedia", rutaMedias); // Cambiado a plural para coincidir con el archivo HTML

// Iniciar el servidor
app.listen(port, () => console.log(`Server Ready in port: ${port}!`));
