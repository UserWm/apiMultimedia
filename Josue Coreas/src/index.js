const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const songsRouter = require("./routes/song");
const path = require("path");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/tracks", express.static(path.join(__dirname, "tracks")));
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.DATABASE_CONNECTION)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", songsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
