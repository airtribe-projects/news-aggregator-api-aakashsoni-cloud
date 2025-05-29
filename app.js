require("dotenv").config(); // at first position
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const usersRouter = require("./src/routes/usersRoutes");
const newsRouter = require("./src/routes/newsRoutes");

const PORT = process.env.PORT || 3000;
const ENDPOINT = process.env.ENDPOINT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${PORT}`);
});

mongoose
  .connect(process.env.DBURI)
  .then(() => {
    console.log("Connected to the MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting the MongoDB", err);
  });

app.use(`${ENDPOINT}/news`, newsRouter);
app.use(`${ENDPOINT}/users`, usersRouter);

module.exports = app;
