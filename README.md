# Ways App
 This app helps you plan the perfect trip! You can also see other trips to get ideas for your trip. 

 ## About the Devs

-[Devon Reihl](https://github.com/DevonReihl) -[Mark Force](https://github.com/Mf-ff99) -[Richard Scott](https://github.com/Richardscripts) -[Will Zeiher](https://github.com/wzeiher3) 

 ## END POINTS
- Auth
    - `/api/auth/token`
        - POST
- Users
    - `/api/user`
        - POST
- Trips
    - `/api/trips`
        - GET
        - POST
    - `/api/trips/:id`
        - GET
        - PATCH
        - DELETE
- Stops
    - `/api/stops`
        - POST 
    - `/api/stops/:stop_id`
        - DELETE
        - PATCH
    - `/api/stops/:trip_id`
        - GET by trip
    - `/allStops/:user_id`
        - GET by the user

- Ratings
    - `/api/rating`
        - POST   
    - `/api/rating/check:id`
        - GET


## Tech Stack

### Development

- Node
  - Authentication JWT
  - RESTFUL API
- Postgresql
  - postgrator

### Testing

- SuperTest (integration tests)
- Mocha and Chai (unit tests)

### Production

- Deployed via Heroku
https://ways-database-api.herokuapp.com/

### Client
- Client repo can be found
https://github.com/wzeiher3/trip-client.git

- Deployed via Vercel
https://ways-client.vercel.app/


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.