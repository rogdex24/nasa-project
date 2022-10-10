const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

/* 
"The callback APIs(fs.*) perform all operations 'asynchronously', without blocking the event loop, then invoke a callback function upon completion or error.""
*/

/*
  With Promises, we can defer the execution of a code block until an async request is completed.
  -> the planetdata loading fxn(fs.* i.e async) is wrapped inside a Promise to wait until it's completed(fulfilled or rejected).
  -> waiting is done by adding `await fxnName()` in server.js
*/

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    // event handler: Open a file as a readable stream i.e Bytes - async
    fs.createReadStream(path.join(__dirname, "../../data/kepler_data.csv"))
      //connecting the stream to the parser w/ pipe.
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      ) // commands are chained and data is passed.
      .on("data", async (data) => {
        // 'on' is a event emitter.
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err); // Promise set to 'rejected'
      })
      .on("end", async() => {
        const countPlanetsFound = (await getAllPlanets());
        console.log(`${countPlanetsFound.length} habitable planets found!`);
        resolve(); // Promise set to 'fulfilled'
      });
  });
}

async function getAllPlanets() {
  // returns all planets - 'Empty Object'
  return await planets.find( {}, {
    '_id': 0,  // ignore id and v and send rest of the fields 
    '__v': 0,  
  });
}

async function savePlanet(planet) {
  try {
    // ONLY add the planet if it doesn't already exist  - To avaoid duplicates
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,  // check if obj with this param already exists
      },
      {
        keplerName: planet.kepler_name,  // if exists update , else create new
      },
      {
        upsert: true, // update + insert
      }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
