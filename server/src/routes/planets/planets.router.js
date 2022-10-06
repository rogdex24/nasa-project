const express = require("express");

const { httpGetAllPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

// routing all "GET /planets" req to getAllPlanets fxn in controller
planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;
