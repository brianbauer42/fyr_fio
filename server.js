#!/usr/bin/env node
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Normally this would have it's own file and perhaps be loaded into environment variables
const config = {
  mongoUri: "mongodb://localhost:27017/FYR_FIO",
  port: 8080,
};

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


// ---------------- API ROUTES ----------------
// app.post("/api/create", /* authenticationCheck, */ createExp);
// app.get("/api/retrieve/:id", /* authenticationCheck, */ getExpByID);


// ---------------- Connection to Databae -----------
mongoose.connect(config.mongoUri, {
  useCreateIndex: true,
  useNewUrlParser: true
});

mongoose.connection.on(
  "error",
  console.error.bind(console, "Connection error!")
);

mongoose.connection.once("open", () => {
  console.log("\x1b[32m%s\x1b[0m", "MongoDB connected successfully");
});

// Render the index (referring to root of views specified in middleware section (__dirname + '/public'))
app.get("/", (req, res) => {
  res.render("index.html");
});

// Begin serving users
app.listen(config.port, "localhost", (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(
    "\x1b[32m%s\x1b[0m", // Green Text
    `service available at localhost:${config.port}` );
});
