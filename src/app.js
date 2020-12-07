const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const authRouter = require("./auth/auth-router");
const tripsRouter = require("./trip/trip-router");
const stopsRouter = require("./stops/stops-router");
const userRouter = require("./user/user-router");
const ratingRouter = require("./rating/rating-router");
const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/stops", stopsRouter);
app.use("/api/rating", ratingRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    // response = { error: { message: "server error" } };
    response = { message: error.message, error };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
