const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Ratings Endpoint', function() {
    let db

    const testUsers = helpers.makeUserArray()
    const [testUser] = testUsers
    const [testTrips, testStops] = helpers.makeTripsAndStops(testUser)
    const [testTrip] = testTrips
    const testRatings = helpers.makeRatingsArray()


    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))
  
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/rating/check/:id', () => {
        context(`Given no ratings`, () => {
            beforeEach('insert users and trips', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips, testStops))

            it(`responds with 200 and an empty array`, () => {
                return supertest(app)
                .get(`/api/rating/check/${testTrip.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(200, [])
            })
        })

        context(` Given there are ratings for trip in database`, () => {
            beforeEach('insert users and trips', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips, testStops, testRatings))

            function rating(testRatings) {
                const altRatings = { user_id: testRatings.user_id, trip_id: testRatings.trip_id }
                return altRatings
            }

            const altRatings = testRatings.map(rating)

            it('responds with 200 and rating for trip', () => {
                const expectedRating = altRatings.filter(rating => rating.trip_id == testTrip.id)

                return supertest(app)
                .get(`/api/rating/check/${testTrip.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(200, expectedRating)
            })
        })
    })

    describe('POST /api/rating', () => {
        beforeEach('insert users and trips', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips, testStops))

        it(`Created a rating, responds with 201 and the rating`, () => {
            const newRating = {
                    user_id: testUser.id,
                    trip_id: testTrip.id,
                    rate: 1,
                    rating: 1,    
            }

            return supertest(app)
            .post('/api/rating')
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .send(newRating)
            .expect(201)
            .expect( res=> {
                expect(res.body[0].user_id).to.eql(newRating.user_id)
                expect(res.body[0].trip_id).to.eql(newRating.trip_id)
                expect(res.body[0].rating).to.eql(newRating.rating)
            })

        })
    })
})