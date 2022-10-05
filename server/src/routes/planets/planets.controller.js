const { getAllPlanets } = require("../../models/planets.model");

// returns the result as 'json' consistently
function httpGetAllPlanets(req, res) {
  return res.status(200).json(getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
