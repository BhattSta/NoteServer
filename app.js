require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./src/middleware/error");
const httpStatus = require("http-status");

const app = express();
const routes = require("./src/routes/index");

// enable cors
app.use(cors());
app.options("*", cors());

// parse json request body
app.use(express.json());

// v1 api routes
app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  console.log(next(new API(httpStatus.NOT_FOUND, "Not found")));
});

// handle error
app.use(errorHandler);

// app.use((err, req, res, next) => {
//   return res
//     .status(err.status || 500)
//     .send(setRes(resCode.InternalServer, null, true, err.message));
// });

module.exports = app;
