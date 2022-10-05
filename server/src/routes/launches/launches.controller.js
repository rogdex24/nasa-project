const { getAllLaunches } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  // 'Array.from' converts the map into the array.
  res.status(200).json(getAllLaunches());
}

module.exports = {
    httpGetAllLaunches,
};
