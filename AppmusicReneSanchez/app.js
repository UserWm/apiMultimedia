const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Path = require("path");
const app = express();
const port = 3000;
app.use(bodyParser.json());
//const mongoURI = "mongodb://host.docker.internal:27017/dbAudios";
const mongoURI = "mongodb://localhost:27017/AudiosDB";
app.use("/uploads", express.static(Path.join(__dirname, "uploads")));
app.use(express.static(Path.join(__dirname, "public")));

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Ready Pa"))
  .catch((err) => console.log(err));

const rutaSongs = require("./rutas/songs");

app.use("/api/songs", rutaSongs);

app.listen(port, () => console.log(`Server Ready in port: ${port}!`));
