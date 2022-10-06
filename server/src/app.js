// express is used a middleware to the http module to create a server
// the 'express app' can be written separately here.
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require('./routes/launches/launches.router')

const app = express();

// 'app.use' -> middleware | chaining of all fxns
// enable CORS for the particular links
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// logging the HTTP requests
app.use(morgan("combined"));
// processing the incoming data
app.use(express.json());
// for hosting the front-end with the backend server
app.use(express.static(path.join(__dirname, "../public")));
// mounting the planets router to express
app.use('/planets', planetsRouter);
app.use('/launches',launchesRouter);
// redirecting '/' to the index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;

/* 
API's in front-end are called from 
client\src\hooks\requests.js
*/
