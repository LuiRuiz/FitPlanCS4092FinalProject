CREATE TABLE IF NOT EXISTS fitusers(
id SERIAL PRIMARY KEY, 
username VARCHAR(255) NOT NULL, 
password VARCHAR(255) NOT NULL, 
email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exercise_events(
id SERIAL PRIMARY KEY,
date DATE NOT NULL,
time TEXT DEFAULT '7:00pm',
exercise_group TEXT,
userid INT,
CONSTRAINT fk_fituser
  FOREIGN KEY(userid)
  REFERENCES fitusers(id)
  ON DELETE CASCADE
);
-- nameing convetions changed a bit here to help integration with Date-fns format for backend logic
CREATE TABLE IF NOT EXISTS preferences(
prefTime TEXT DEFAULT '7:00pm',
restDays INTEGER,
Monday BOOLEAN,
Tuesday BOOLEAN,
Wednesday BOOLEAN,
Thursday BOOLEAN,
Friday BOOLEAN,
Saturday BOOLEAN,
Sunday BOOLEAN,
userid INTEGER NOT NULL,
CONSTRAINT preferences_pkey PRIMARY KEY (userid),
CONSTRAINT fk_fituser
  FOREIGN KEY(userid)
  REFERENCES fitusers(id)
  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_logs(
id BIGSERIAL PRIMARY KEY,
workout_name TEXT,
weight INTEGER,
reps INTEGER,
sets INTEGER,
event_id INT,
CONSTRAINT fk_event
 FOREIGN KEY(event_id)
 REFERENCES exercise_events(id)
 ON DELETE CASCADE
);
-- these inserts wont create the eact same rows as the demo 
--      because I have been testing those tables for longer
 -- creating 3 users with userid's: 1, 2, 3,
INSERT into fitusers (username, password, email)
VALUES 
('LuiRui', 'burgerman123', 'burger@burger.com'),
('test2', 'test123', 'test2@apple.com'),
('me', 'password', 'fakeemail@apple.com');

INSERT INTO preferences
(userid, prefTime, restDays, Monday, Tuesday, Wednesday,Thursday, Friday, Saturday, Sunday)
VALUES
(1, '6:00pm', 2, True, False, True, False, True, False, True),
(2, '7:00pm', 1, True, True, True, True, True, True, True);

-- creates exercise_events with id 1, 2 for two different users
INSERT INTO exercise_events
(userid, date, time, exercise_group)
VALUES 
(1, '2025-08-08', '6:00pm', 'Leg Day'),
(2, '2025-08-08', '7:00pm' , 'Pushday' );
-- creates workout_logs for the exercise_events just created
INSERT INTO workout_logs
(event_id, workout_name, weight, reps, sets)
VALUES
(1, 'Leg Press', 200, 10, 3),
(2, 'Chest Press', 180, 12, 2);

--Multi Table Query file in backend folder









