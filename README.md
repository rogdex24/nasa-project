# NASA Mission Control Project

**Tech Stack**: *Node.js, Expressjs, MongoDB, Docker, AWS*  
[Live Demo of the website](http://nasa.rogdex24.me/) 

- Developed a **REST API** using NodeJS and **express.js** that performs **CRUD** operations like sending requested mission data and writing the data to **MongoDB**, retrieve and delete selected entries form the database.
- Finds out Kepler planets which are habitable from the data provided from Kepler Satelites.
- Communicates w/ the SpaceX REST API to populate the historical data of missions to the MongoDB database.
- Used **GitHub Actions** to make a continuous integration workflow that builds and tests the code for production.
- Containerized the website using **Docker**, published it to dockerhub and hosted the container on **AWS EC2**.


## Getting Started

1. Ensure you have Node.js installed.
2. Create a free [Mongo Atlas](https://www.mongodb.com/atlas/database) database online or start a local MongoDB database.
3. Create a `server/.env` file with a `MONGO_URL` property set to your MongoDB connection string.
4. In the terminal, run: `npm install`

## Running the Project

1. In the terminal, run: `npm run deploy`
2. Browse to the mission control frontend at [localhost:8000](http://localhost:8000) and schedule an interstellar launch!

## Docker

1. Ensure you have the latest version of Docker installed
2. Run `docker build -t nasa-project .`
3. Run `docker run -it -p 8000:8000 nasa-project`

## Running the Tests

To run any automated tests, run `npm test`. This will: 
* Run all the client-side tests: `npm test --prefix client`
* Run all the server-side tests: `npm test --prefix server` 
