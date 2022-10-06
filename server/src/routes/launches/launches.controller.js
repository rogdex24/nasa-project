const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchesWithId,
  abortLaunchById,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return await res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  // input data from POST req
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  // convert launchdate from string to Date object
  launch.launchDate = new Date(launch.launchDate);
  // NaN - Not A Number
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  addNewLaunch(launch);

  return res.status(200).json({
    status: "done",
  });
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  if (!existsLaunchesWithId(launchId)) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }
  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
