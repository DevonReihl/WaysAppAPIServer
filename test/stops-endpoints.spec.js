const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')


describe('Stops Endpoints', function () {
    let db

    const testUsers = helpers.makeUserArray()
    const [testUser] = testUsers
    const [testTrips, testStops] = helpers.makeTripsAndStops(testUser)

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))
  
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/stops/allStops/:user_id', () => {
        context(`Given no stops`, () => {
            it(`responds with 200 and an empty array`, () => {
                return supertest(app)
                .get(`/api/stops/allStops/${testUser.id}`)
                .expect(200, [])
            })
        })

        context(`Given there are stops in the database`, () => {
            beforeEach('insert users, trips and stops', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips, testStops))

             
            function cityAndStateStop(stop) {
                const altStop = { city: stop.city, state: stop.state}
                return altStop
            }

            const altTestStops = testStops.map(cityAndStateStop)

            it('responds with 200 and all stops for id', () => {
                return supertest(app)
                .get(`/api/stops/allStops/${testUser.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(200, altTestStops)
            })
        })
    })

    describe('POST /api/stops', () => {
        beforeEach('insert users, trips and stops', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips, testStops))

        it(`Creates a stop, responds with 201 and the stop`, () => {
            const newStop = {
                longitude: -81.5639,
                latitude: 28.3852,
                city: 'Orlando',
                state: 'FL',
                stop_name: 'Disneyworld',
                description: 'The magic home of Mickey Mouse',
                category: 'Tourist attraction',
                img: 'https://live.staticflickr.com/1538/26267224082_eb0e696f92.jpg',
                trip_id: testTrips[0].id
            }

            return supertest(app)
            .post('/api/stops')
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .send(newStop)
            .expect(201)
            .expect( res => {
                expect(res.body.longitude).to.eql(newStop.longitude)
                expect(res.body.latitude).to.eql(newStop.latitude)
                expect(res.body.city).to.eql(newStop.city)
                expect(res.body.state).to.eql(newStop.state)
                expect(res.body.stop_name).to.eql(newStop.stop_name)
                expect(res.body.description).to.eql(newStop.description)
                expect(res.body.category).to.eql(newStop.category)
                expect(res.body.img).to.eql(newStop.img)
                expect(res.body).to.have.property('id')
            })
        })
    })

    describe('PATCH /api/stops/:stop_id', () => {
        beforeEach('insert users and trips', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips, testStops))

        it('resonds with 201 and updates the stop', () => {
            const idToUpdate = 1

            const updateStop = {
                'stop_name': 'The Magic Kingdom',
                'description': 'Disneyworld',
                'category': 'Tourist attraction',
                'img': 'https://live.staticflickr.com/1538/26267224082_eb0e696f92.jpg',
                'trip_id': testTrips[0].id,
            }

            return supertest(app)
            .patch(`/api/stops/${idToUpdate}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .send(updateStop)
            .expect(201)
        })
    })

    describe('DELETE /api/stops/:stop_id', () => {
        context('Given there is the stop in database', () => {
            beforeEach('insert users and trips', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips, testStops))

            it('removes the stop by ID', () => {
                const idToRemove = 1
                const expectedStops = testStops.filter(stop => stop.id !== idToRemove)
                
                return supertest(app)
                .delete(`/api/stops/${idToRemove}`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(204)
                .then(() => 
                    supertest(app)
                    .get(`/api/stops/${testTrips[1].id}`)
                    .expect(expectedStops)
                )
            })
        })
    })

}) 