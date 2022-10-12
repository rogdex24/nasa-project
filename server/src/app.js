const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const api = require("./routes/api");

const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("combined"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/v1", api);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;

/* 
API's in front-end are called from 
client\src\hooks\requests.js
*/
