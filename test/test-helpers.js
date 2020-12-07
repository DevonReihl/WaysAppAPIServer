require('dotenv').config();
const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



//create a knex instance to postgres
function makeKnexInstance() {
    return knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
    })
}


function cleanTables(db) {
    return db.transaction(trx => 
        trx.raw(
            `TRUNCATE
                "stops",
                "ratings",
                "trips",
                "ways_users"`
        )
        .then(() => 
            Promise.all([
                trx.raw(`ALTER SEQUENCE stops_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE trips_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE ways_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('stops_id_seq', 0)`),
                trx.raw(`SELECT setval('trips_id_seq', 0)`),
                trx.raw(`SELECT setval('ways_users_id_seq', 0)`),
                
                

            ])
        )
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

function makeUserArray() {
    return [
        {
            id: 1,
            user_name: 'test-user-1',
            password: 'password',
        },
        {
            id: 2,
            user_name: 'test-user-2',
            password: 'password!',
        },
    ]
}

function makeRatingsArray() {
    return [
        {
            user_id: 1,
            trip_id: 1,
            rating: 1,
        },

        {
            user_id: 2,
            trip_id: 2,
            rating: 1,
        },
    ]
}

function makeTripsAndStops(user) {
    const trips = [
        {  
            id: 1,
            date_added: '2020-10-29T16:39:14.898Z',
            destination: 'someplace to go',
            short_description: 'words about what you did there',
            activities: 'restaurant',
            rating: 1,
            days: 2,
            img: 'picture1',
            user_id: user.id,
        },
        {
            id: 2,
            date_added: '2020-11-30T16:39:14.898Z',
            destination: 'someplace else to go',
            short_description: 'words about what you did else there',
            activities: 'sight-seeing',    
            rating: 1,
            days: 3,
            img: 'picture',
            user_id: user.id,
        },
    ]

    const stops = [
        {
            id: 1,
            longitude: -112.1129,
            latitude: 36.1069,
            city: 'Flagstaff',
            state: 'AZ',
            stop_name: 'Grand Canyon',
            description: 'I great big, beautiful hole in the ground',
            category: 'tourist_attraction',
            img: 'some picture',
            trip_id: 1
        },

        {
            id: 2,
            longitude: -81.5639,
            latitude: 28.3852,
            city: 'Orlando',
            state: 'FL',
            stop_name: 'Disneyworld',
            description: 'The second home of Mickey Mouse',
            category: 'tourist_attraction',
            img: 'some picture',
            trip_id: 2
        },

        {
            id: 3,
            longitude: -81.5639,
            latitude: 28.3852,
            city: 'Orlando',
            state: 'FL',
            stop_name: 'Universal Studios',
            description: 'Great rides and great place',
            category: 'tourist_attraction',
            img: 'some picture',
            trip_id: 2
        },
    ]

    return [trips, stops]
}

function seedUsers(db, ways_users) {
    const preppedUsers = ways_users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.transaction(async trx => {
        await trx.into('ways_users').insert(preppedUsers)

        await trx.raw(
            `SELECT setval('ways_users_id_seq', ?)`,
            [ways_users[ways_users.length - 1].id],
        )
    })
}



async function seedTripsAndStopsAndRatings(db, users, trips, stops, ratings) {
    await seedUsers(db, users)

    await db.transaction(async trx => {
        await trx.into('trips').insert(trips)
        await trx.into('stops').insert(stops)
        await trx.into('ratings').insert(ratings)

        await Promise.all([
            trx.raw(
                `SELECT setval('trips_id_seq', ?)`,
                [trips[trips.length -1].id],
            ),
            trx.raw(
                `SELECT setval('stops_id_seq', ?)`,
                [stops[stops.length -1].id],
            ),
        ])
    })
}


module.exports = {
    makeKnexInstance,
    makeUserArray,
    makeTripsAndStops,
    makeAuthHeader,
    makeRatingsArray,
    cleanTables,
    seedUsers,
    seedTripsAndStopsAndRatings,
}