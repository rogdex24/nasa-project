const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

// const launch = {
//   // corresponding spaceX API prop
//   flightNumber: 100, // flight_number
//   mission: "Kepler Exploration X", // name
//   rocket: "Explorer IS1", // rocket.name
//   launchDate: new Date("December 27, 2030"), // date_local
//   target: "Kepler-442 b", // not applicable
//   customers: ["ZTM", "NASA"], // payload.customers
//   upcoming: true, // upcoming
//   success: true, // success
// };
// // adding the first default value
// saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading launch data...");

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status != 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    if (launchDoc["payloads"].length > 0) {
      customers = launchDoc["payloads"][0]["customers"];
      // console.log(customers);
    } else {
      customers = [];
    }
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers: customers,
    };
    saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (!firstLaunch) {
    console.log("Launch data already loaded!");
    return;
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchesWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase
    .findOne() // return first occuring obj
    .sort("-flightNumber"); // sort in descending order of flightnumber

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find({}, { _id: 0, __V: 0 })
    .sort({ flightNumber: 1 }) // sort according to flightnumber
    .skip(skip) // skips first n elements - to set pages
    .limit(limit); // limits output to first n elements
}

async function saveLaunch(launch) {
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

async function scheduleNewLaunch(launch) {
  // return one object matching the field
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  // check if the launching planet exists in planetsDatabse
  if (!planet) {
    throw new Error("No matching planet found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
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
  loadLaunchData,
  existsLaunchesWithId,
  getAllLaunches,
  abortLaunchById,
  scheduleNewLaunch,
};
