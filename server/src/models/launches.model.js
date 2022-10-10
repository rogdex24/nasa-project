const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};
// adding the first default value
saveLaunch(launch);

async function existsLaunchesWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase
    .findOne() // return first occuring obj
    .sort("-flightNumber"); // sort in descending order

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __V: 0 });
}

async function saveLaunch(launch) {
  // return one object matching the field
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  // check if the launching planet exists in planetsDatabse
  if (!planet) {
    throw new Error("No matching planet found");
  }

  // will only return prop. we set in update=>'launch' rather than "updateOne()" which adds and returns some extra prop.
  await launchesDatabase.findOneAndUpdate(
    // findOne + Update
    {
      flightNumber: launch.flightNumber, // check if this obj already exists
    },
    launch, // update with this obj if exists , else create new
    {
      upsert: true, // this enables it
    }
  );
}

async function scheduleNewLaunch(launchInput) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launchInput, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  // update if exists !NO CREATING NEW OBJ!
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId, // if obj with this prop. found
    },
    {
      upcoming: false, // update these prop. of it obj
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunchesWithId,
  getAllLaunches,
  abortLaunchById,
  scheduleNewLaunch,
};
