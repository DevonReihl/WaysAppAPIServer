// Service Objects:

const xss = require("xss");

const TripService = {
  getTrips(db) {
    return db("ratings")
      .select("ratings.rating")
      .sum("ratings.rating AS rating")
      .fullOuterJoin("trips", "trips.id", "=", "ratings.trip_id")
      .select(
        "trips.short_description",
        "trips.id",
        "trips.destination",
        "trips.activities",
        "trips.img",
        "trips.days",
        "trips.date_added",
        "trips.user_id"
      )
      .groupBy(
        "ratings.rating",
        "trips.short_description",
        "trips.id",
        "trips.destination",
        "trips.activities",
        "trips.img",
        "trips.days",
        "trips.date_added",
        "trips.user_id"
      )
      .then((res) => {
        return res;
      });
  },

  insertTrip(db, newTrip) {
    return db.insert(newTrip).into("trips").returning("*");
  },

  getTripsById(db, id) {
    return db("ratings")
      .select("ratings.rating")
      .sum("ratings.rating AS rating")
      .fullOuterJoin("trips", "trips.id", "=", "ratings.trip_id")
      .select(
        "trips.short_description",
        "trips.id",
        "trips.destination",
        "trips.activities",
        "trips.img",
        "trips.days",
        "trips.date_added",
        "trips.user_id",
        "trips.lat",
        "trips.long"
      )
      .where("trips.id", id)
      .groupBy(
        "ratings.rating",
        "trips.short_description",
        "trips.id",
        "trips.destination",
        "trips.activities",
        "trips.img",
        "trips.days",
        "trips.date_added",
        "trips.user_id",
        "trips.lat",
        "trips.long"
      );
  },

  getTripsForUser(db, user_id) {
    return db("ratings")
      .select("ratings.rating")
      .sum("ratings.rating AS rating")
      .fullOuterJoin("trips", "trips.id", "=", "ratings.trip_id")
      .select(
        "trips.short_description",
        "trips.id",
        "trips.destination",
        "trips.activities",
        "trips.img",
        "trips.days",
        "trips.date_added",
        "trips.user_id"
      )
      .where("trips.user_id", user_id)
      .groupBy(
        "ratings.rating",
        "trips.short_description",
        "trips.id",
        "trips.destination",
        "trips.activities",
        "trips.img",
        "trips.days",
        "trips.date_added",
        "trips.user_id"
      );
  },

  deleteTrip(db, id) {
    return db("trips").where({ id }).delete();
  },

  updateTrip(db, id, newTripFields) {
    return db("trips").where({ id }).update(newTripFields).returning("*");
  },

  serializeTrip(trip) {
    return {
      id: trip.id,
      short_description: xss(trip.short_description),
      rating: trip.rating,
      destination: xss(trip.destination),
      days: trip.days,
      activities: trip.activities,
      user_id: trip.user_id,
      img: trip.img,
      long: trip.long,
      lat: trip.long,
    };
  },

  verifyTripCreatorAuth(db, id) {
    return db("trips").select("user_id").where({ id }).first();
  },
};

module.exports = TripService;
