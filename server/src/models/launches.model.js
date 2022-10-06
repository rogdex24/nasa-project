const launches = new Map();

latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};
// hardcoding the first default value
launches.set(launch.flightNumber, launch);

function existsLaunchesWithId(launchId) {
  return launches.has(launchId);
}

// 'Array.from' converts the map into an array.
function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launchInput){
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launchInput, // assign additional properties 
      {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: latestFlightNumber,
      }
    ));
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchesWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
