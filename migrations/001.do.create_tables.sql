CREATE TABLE ways_users (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trips (
    user_id INTEGER REFERENCES ways_users(id) ON DELETE CASCADE NOT NULL,
    id SERIAL PRIMARY KEY,
    date_added TIMESTAMPTZ NOT NULL DEFAULT now(),
    short_description TEXT NOT NULL, 
    long FLOAT NOT NULL,
    lat FLOAT NOT NULL,
    rating INTEGER DEFAULT NULL,
    destination TEXT NOT NULL,
    activities TEXT NOT NULL,
    img TEXT NOT NULL,
    days INT NOT NULL
);

CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
    longitude FLOAT NOT NULL,
    latitude FLOAT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    stop_name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    img TEXT        
);

CREATE TABLE ratings(
  trip_id INTEGER references trips(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER references ways_users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL,
  PRIMARY KEY (trip_id, user_id)
);	
