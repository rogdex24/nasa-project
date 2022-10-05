const { httpGetAllLaunches } = require("./launches.controller");

const express = require('express');
const getLaunches = require("./launches.controller");

launchesRouter = express.Router();

launchesRouter.get("/launches", httpGetAllLaunches);

module.exports = launchesRouter;
