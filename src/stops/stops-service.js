const xss = require("xss");

const StopService = {
  getAllStops(db, user_id) {
    return db("stops")
      .select("stops.city", "stops.state")
      .join("trips", "trips.id", "=", "stops.trip_id")
      .where("trips.user_id", user_id);
  },

  insertStop(db, newStop) {
    return db.insert(newStop).into("stops").returning("*");
  },

  getStopsById(db, id) {
    return db.select("*").from("stops").where("stops.trip_id", id);
  },

  deleteStop(db, id) {
    return db("stops").where({ id }).delete();
  },

  updateStop(db, id, newStopFields) {
    return db("stops").where({ id }).update(newStopFields).returning("*");
  },

  serializeStop(stop) {
    return {
      trip_id: stop.trip_id,
      longitude: stop.longitude,
      latitude: stop.latitude,
      city: xss(stop.city),
      state: xss(stop.state),
      stop_name: xss(stop.stop_name),
      description: xss(stop.description),
      category: xss(stop.category),
      id: stop.id,
      img: xss(stop.img),
    };
  },
  getTripCreatorByTripId(db, id) {
    return db("trips").select("user_id").where({ id }).first();
  },
  getTripCreatorByStopId(db, id) {
    return db("stops")
      .select("trips.user_id")
      .join("trips", "stops.trip_id", "trips.id")
      .where({ "stops.id": id })
      .first();
  },
};

module.exports = StopService;
