const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Trips Endpoints', function () {
    let db

    const testUsers = helpers.makeUserArray()
    const [testUser] = testUsers
    const [testTrips, testStops] = helpers.makeTripsAndStops(testUser)
    const testRating = helpers.makeRatingsArray()

    const altTestTrips = testTrips.map(trip => ({
        ...trip, rating: trip.rating.toString()
    }))

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))
  
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/trips', () => {
        context(`Given no trips`, () => {
            it(`responds with 200 and an empty array`, () => {
                return supertest(app)
                .get('/api/trips')
                .expect(200, [])
            })
        })

        context(`Given there are trips in the database`, () => {
            beforeEach('insert users and trips', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips, testStops, testRating))

            it('responds with 200 and all trips', () => {
                return supertest(app)
                .get('/api/trips')
                .expect(200, altTestTrips)
            })
        })
    })

    describe('POST /api/trips', () => {
        beforeEach('insert users', () => helpers.seedUsers(db, testUsers,))
         
            it(`Creates a trip, responds with 201 and new trip`, () => {
                const newTrip = {
                    "user_id": testUser.id,
                    "id": 4,
                    "date_added": "2020-11-25T17:22:33.075Z",
                    "short_description": "New York, baby!",
                    "long": -73.98513,
                    "lat": 40.758896,
                    "rating": 1,
                    "destination": "New York, NY",
                    "activities": "Shopping, Sight-Seeing",
                    "img": "city",
                    "days": 2
                }
                return supertest(app)
                .post('/api/trips')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newTrip)
                .expect(201)
                .expect( res => {
                    expect(res.body.short_description).to.eql(newTrip.short_description)
                    expect(res.body.destination).to.eql(newTrip.destination)
                    expect(res.body.activities).to.eql(newTrip.activities)
                    expect(res.body.img).to.eql(newTrip.img)
                    expect(res.body.days).to.eql(newTrip.days)
                    expect(res.body).to.have.property('id')
                    
                })
                
            })
    })

    describe('PATCH /api/trips/:id', () => {
        beforeEach('insert users and trips', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips, testStops, testRating))
        
        it('responds with 201 and updates the trip', () => {
            const idToUpdate = 2
            
            const updateTrip = {
                'destination': 'someplace else to go',
                'short_description': 'in the world',
                'activities': 'having fun',
                'days': 3,
                'img': 'picture',
                'user_id': testUser.id,
            }

            return supertest(app)
            .patch(`/api/trips/${idToUpdate}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .send(updateTrip)
            .expect(201)
        })
    })

    describe('DELETE /api/trips/:id', () => {
        context('Given there are trips in the database', () => {

            beforeEach('insert users and trips', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips, testStops))

            it('removes the trip by ID', () => {
                const idToRemove = 2
                const expectedTrips = testTrips.filter(trip => trip.id !== idToRemove)
                return supertest(app)
                .delete(`/api/trips/${idToRemove}`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(204)
            })
        })
    })
})