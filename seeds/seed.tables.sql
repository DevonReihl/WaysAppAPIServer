BEGIN;

TRUNCATE
  stops,
  trips,
  ways_users,
  ratings;

INSERT INTO ways_users 
(id, user_name, password) 
VALUES 
(1, 'John Rambo', '$2a$12$UcN8ux9F9ziecnzMU0vtUuC3lG416D0qiBR82NPLc6e2WNpKA3STC'), --password
(2, 'Tony Starks', '$2a$12$UcN8ux9F9ziecnzMU0vtUuC3lG416D0qiBR82NPLc6e2WNpKA3STC'), --passowrd
(3, 'Natasha Romanova', '$2a$12$UcN8ux9F9ziecnzMU0vtUuC3lG416D0qiBR82NPLc6e2WNpKA3STC'); --password

INSERT INTO trips
(id, user_id, short_description, long, lat, rating, destination, days, activities, img) 
VALUES 
(1, 1, 'Disneyworld Trip',-81.5639, 28.3852, 5, 'Orlando, FL', 1, 'DisneyLand, Wax-Museum', 'amusementpark'),
(2, 2, 'New York, baby!',-73.985130, 40.758896, 2, 'New York, NY', 2, 'Shopping, Sight-Seeing', 'city'),
(3, 3, 'Las Vegas Night Life', -115.1398, 36.1699, 4, 'Las Vegas, NV', 3, 'Casinos, Sight-Seeing', 'nightlife'),
(4, 3, 'Windy City Heat', 41.8781, 87.6298, 2, 'Chicago, IL', 2, 'Shopping, Sight-Seeing', 'countryside'),
(5, 2, 'Maple Leaf State', 43.6532, 79.3832, 2, 'Toronto', 2, 'Shopping, Aquarium', 'mountain');


INSERT INTO stops 
(trip_id, longitude, latitude, city, state, stop_name, description, category, img) 
VALUES 
(1, '-81.5639', '28.3852', 'Orlando', 'FL', 'Disneyworld', 'The Walt Disney World Resort, also called Walt Disney World and Disney World, is an entertainment complex in Bay Lake and Lake Buena Vista, Florida, in the United States, near the cities of Orlando and Kissimmee.', 'Tourist Attraction', 'https://live.staticflickr.com/1538/26267224082_eb0e696f92.jpg'),
(1, '-81.5639', '28.3852','Orlando', 'FL', 'Madame Tussauds', 'See life-size figures of your favorite celebrities at Madame Tussauds Orlando with this pre-purchased admission.', 'Tourist Attraction', 'https://live.staticflickr.com/65535/50204118936_114e0abd86.jpg'),
(2, '-73.985130', '40.758896', 'New York City', 'NY', 'Times Square', 'Lots of cool shit to see here', 'tourist_attraction', 'https://live.staticflickr.com/1580/24036829791_1d15b38993.jpg'),
(2, '-73.966562', '40.781317', 'New York City', 'NY', 'Central Park', 'This is a big ass park. Go here for your daily does of greenery.', 'Tourist Attraction', 'https://live.staticflickr.com/7398/28132606265_080649d857.jpg'),
(3, '-115.1398', '36.1699','Las Vegas', 'NV', 'Eiffel Tower', 'Elevated French haunt offering Strip views from the 11th floor of Paris Las Vegas', 'Tourist Attraction', 'https://live.staticflickr.com/65535/26721413146_438c3a7987.jpg'),
(3, '-115.1398', '36.1699','Las Vegas', 'NV', 'Venetian Hotel', 'The Venetian Hotel in Las Vegas is located on the Strip, across from Treasure Island.', 'Tourist Attraction', 'https://live.staticflickr.com/65535/49616923966_be21157eab.jpg'),
(4, '-79.3881603', '43.6424036','Toronto', 'Canada', 'Ripley''s Aquarium of Canada', 'Explore the Waters of the World at Ripley''s Aquarium of Canada.', 'Aquarium', 'https://live.staticflickr.com/5668/22874562822_d6d809776c.jpg'),
(4, '-79.465879', '43.6465479','Toronto', 'Canada', 'High Park', 'Sprawling park with hiking trails, a zoo, sports fields & a large children''s playground.', 'Park', 'https://live.staticflickr.com/5332/31123187085_1662372980.jpg'),
(5, '-115.1398', '36.1699','Chicago', 'IL', 'Magnificent Mile', 'Shopping center in an upscale section of Chicago''s Michigan Avenue, running from the Chicago River to Oak Street .', 'Shopping Mall', 'https://live.staticflickr.com/5675/30309433946_585157ed34.jpg');


INSERT INTO ratings (trip_id, user_id, rating)
VALUES
(1, 1, 1),
(2, 2, 1),
(1, 2, 1),
(3, 1, 1);

SELECT setval('stops_id_seq', (SELECT MAX(id) from "stops"));
SELECT setval('trips_id_seq', (SELECT MAX(id) from "trips"));
SELECT setval('ways_users_id_seq', (SELECT MAX(id) from "ways_users"));

COMMIT;

