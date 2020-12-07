const express = require("express");
const TripService = require("./trip-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { Console } = require("winston/lib/winston/transports");
const StopsService = require("../stops/stops-service");

const tripsRouter = express.Router();

tripsRouter
  .route("/")
  .get((req, res, next) => {
    const db = req.app.get("db");
    TripService.getTrips(db)
      .then((trips) => {
        res.json(trips);
      })
      .catch(next);
  })
  .post(requireAuth, (req, res, next) => {
    const db = req.app.get("db");
    const {
      short_description,
      destination,
      days,
      activities,
      img,
      long,
      lat,
    } = req.body;

    const newTrip = {
      short_description,
      destination,
      days,
      activities,
      img,
      long,
      lat,
    };

    for (const [key, value] of Object.entries(newTrip)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    newTrip.user_id = req.user.id;
    TripService.insertTrip(db, newTrip)
      .then(([trip]) => {
        res.status(201).json(TripService.serializeTrip(trip));
      })
      .catch(next);
  });

tripsRouter
  .route("/:id")
  .all((req, res, next) => {
    TripService.getTripsById(req.app.get("db"), parseInt(req.params.id))
      .then((trip) => {
        if (!trip) {
          return res.status(404).json({
            error: { message: `Trip does not exist` },
          });
        }
        req.trip = trip;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(req.trip);
  })
  .delete(requireAuth, (req, res, next) => {
    StopsService.getTripCreatorByTripId(req.app.get("db"), req.params.id).then(
      (verifiedID) => {
        if (verifiedID.user_id === req.user.id) {
          TripService.deleteTrip(req.app.get("db"), parseInt(req.params.id))
            .then(() => {
              res.status(204).end();
            })
            .catch(next);
        } else {
          res.status(401).json({
            error: `Unauthorized Access`,
          });
        }
      }
    );
  })
  .patch(requireAuth, (req, res, next) => {
    const { short_description, days, activities, img } = req.body;
    const updateTrip = {
      short_description,
      days,
      activities,
      img,
    };

    const valuesToUpdate = Object.values(updateTrip).filter(Boolean).length;
    if (valuesToUpdate === 0)
      return res.status(400).json({
        error: { message: `Request body must contain a value to be updated` },
      });

    StopsService.getTripCreatorByTripId(req.app.get("db"), req.params.id).then(
      (verifiedID) => {
        if (verifiedID.user_id === req.user.id) {
          TripService.updateTrip(
            req.app.get("db"),
            parseInt(req.params.id),
            updateTrip
          )
            .then((result) => {
              res.status(201).json(result.map(TripService.serializeTrip));
            })
            .catch(next);
        } else {
          res.status(401).json({
            error: `Unauthorized Access`,
          });
        }
      }
    );
  });

module.exports = tripsRouter;
