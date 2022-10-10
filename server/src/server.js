// The purpose of using 'express w/ http' module is to work also with other type of conn. like web sockets etc. and not just with http requests.
const http = require("http");

const app = require("./app");

const { mongoConnect } = require('./services/mongo');

const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;
// adding the express app to http server
const server = http.createServer(app);

// 'async'hronous fxn to a'wait' for loading planets data AND ONLY THEN -> start the server
// await is written only with asynchronous functions.
async function startServer() {
  await mongoConnect();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
}

startServer();
