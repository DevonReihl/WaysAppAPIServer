const express = require("express");
const RatingService = require("../rating/rating-service");
const { requireAuth } = require("../middleware/jwt-auth");

const ratingRouter = express.Router();

ratingRouter.route("/check/:id").get(requireAuth, (req, res, next) => {
  const db = req.app.get("db");
  const { id } = req.params;
  const user_id = req.user.id;
  const userInfo = { id, user_id };

  RatingService.checkForDuplicateRating(db, userInfo)
    .then((info) => {
      res.json(info);
    })
    .catch(next);
});

ratingRouter.route("/").post(requireAuth, (req, res, next) => {
  const db = req.app.get("db");
  const { trip_id, user_id, rate } = req.body;
  let rating = rate;
  const newRating = { trip_id, user_id, rating };
  RatingService.insertRating(db, newRating)
    .then((rating) => {
      res.status(201).json(rating);
    })
    .catch(next);
});

module.exports = ratingRouter;
