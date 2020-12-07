const RatingService = {
  insertRating(db, rating) {
    return db.insert(rating).into("ratings").returning("*");
  },

  checkForDuplicateRating(db, userInfo) {
    return db("ratings")
      .select("ratings.user_id", "ratings.trip_id")
      .where("ratings.trip_id", userInfo.id)
      .returning("*");
  },
};

module.exports = RatingService;
