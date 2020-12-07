const express = require("express");
const StopsService = require("./stops-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { Console } = require("winston/lib/winston/transports");
const stopsRouter = express.Router();

stopsRouter.get("/allStops/:user_id", (req, res, next) => {
  const db = req.app.get("db");
  const id = req.params.user_id;
  StopsService.getAllStops(db, id)
    .then((stops) => {
      res.json(stops);
    })
    .catch(next);
});

stopsRouter.get("/:trip_id", (req, res, next) => {
  const db = req.app.get("db");
  const id = req.params.trip_id;
  StopsService.getStopsById(db, id)
    .then((stops) => {
      res.json(stops);
    })
    .catch(next);
});

stopsRouter.route("/").post(requireAuth, (req, res, next) => {
  const db = req.app.get("db");
  const {
    trip_id,
    longitude,
    latitude,
    city,
    state,
    stop_name,
    description,
    category,
    img,
  } = req.body;

  const newStop = {
    trip_id,
    longitude,
    latitude,
    city,
    state,
    stop_name,
    description,
    category,
  };

  for (const [key, value] of Object.entries(newStop))
    if (!value)
      return res.status(400).json({
        error: `Missing required '${key}'`,
      });

  newStop.img = img;

  StopsService.getTripCreatorByTripId(db, trip_id)
    .then((verifiedID) => {
      if (verifiedID.user_id === req.user.id) {
        StopsService.insertStop(db, newStop)
          .then(([result]) => {
            res.status(201).json(StopsService.serializeStop(result));
          })
          .catch(next);
      } else {
        res.status(401).json({
          error: `Unauthorized Access`,
        });
      }
    })
    .catch(next);
});

stopsRouter
  .route("/:stop_id")
  .all((req, res, next) => {
    StopsService.getStopsById(req.app.get("db"), parseInt(req.params.stop_id))
      .then((stops) => {
        if (!stops) {
          res.status(404).json({
            error: { message: `Stop does not exist` },
          });
        } else {
          res.stops = stops;
          next();
        }
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    StopsService.getTripCreatorByStopId(
      req.app.get("db"),
      req.params.stop_id
    ).then((verifiedID) => {
      if (verifiedID.user_id === req.user.id) {
        StopsService.deleteStop(req.app.get("db"), parseInt(req.params.stop_id))
          .then(() => {
            res.status(204).end();
          })
          .catch(next);
      } else {
        res.status(401).json({
          error: `Unauthorized Access`,
        });
      }
    });
  })
  .patch(requireAuth, (req, res, next) => {
    const {
      trip_id,
      longitude,
      latitude,
      city,
      state,
      stop_name,
      description,
      category,
      img,
    } = req.body;

    const updateStop = {
      trip_id,
      longitude,
      latitude,
      city,
      state,
      stop_name,
      description,
      category,
      img,
    };

    const valuesToUpdate = Object.values(updateStop).filter(Boolean).length;
    if (valuesToUpdate === 0)
      return res.status(400).json({
        error: { message: `Request body must contain a value to be updated` },
      });

    StopsService.getTripCreatorByTripId(req.app.get("db"), trip_id).then(
      (verifiedID) => {
        if (verifiedID.user_id === req.user.id) {
          StopsService.updateStop(
            req.app.get("db"),
            parseInt(req.params.stop_id),
            updateStop
          )
            .then(([result]) => {
              res.status(201).json(StopsService.serializeStop(result));
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

module.exports = stopsRouter;
