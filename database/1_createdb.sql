CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS events_submit;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    name VARCHAR,
    email VARCHAR,
    password VARCHAR,
    role VARCHAR
);

INSERT INTO users (name,email,password,role)
VALUES ('Admin','admin@test.com',crypt('123456789', gen_salt('bf')),'admin'),
       ('Orga 1','orga1@test.com',crypt('123456789', gen_salt('bf')),'organisateur'),
       ('Orga 2','orga2@test.com',crypt('123456789', gen_salt('bf')),'organisateur'),
       ('Part 1','part1@test.com',crypt('123456789', gen_salt('bf')),'participant'),
       ('Part 2','part2@test.com',crypt('123456789', gen_salt('bf')),'participant');
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE(email);

CREATE TABLE events (
    id_event SERIAL PRIMARY KEY,
    title VARCHAR,
    description VARCHAR,
    date TIMESTAMP,
    location VARCHAR,
    totalSeats INT,
    createdBy INT,
    FOREIGN KEY (createdBy) REFERENCES users(id_user)
);

INSERT INTO events (title, description,date,location,totalSeats,createdBy)
VALUES ('Vue Conference','Conférence sur Vue 3','2025-10-10 14:30:00','Paris',50,2),
       ('React Summit','Conférence avancée sur React 18','2025-11-15 09:00:00','Lyon',80,2),
       ('Node.js Connect','Événement backend autour de Node.js','2025-12-05 10:00:00','Marseille',60,3),
       ('JavaScript World','Salon dédié à l’écosystème JavaScript','2026-01-20 08:30:00','Bordeaux',120,2),
       ('DevOps Days','Conférence sur CI/CD et Cloud','2026-02-10 09:30:00','Toulouse',70,3),
       ('AI & Web Summit','L’intelligence artificielle appliquée au web','2026-03-18 14:00:00','Nice',90,3),
       ('Fullstack Bootcamp','Workshop intensif Fullstack JS','2026-04-12 09:00:00','Lille',40,2),
       ('Cyber Security Expo','Sécurité des applications web','2026-05-22 10:30:00','Strasbourg',75,3),
       ('Mobile Dev Conference','Développement mobile avec Flutter & React Native','2026-06-14 09:00:00','Nantes',65,2),
       ('IA Conference','IA Conference made by Total','2026-06-14 12:00:00','Paris',1,2);

CREATE TABLE events_submit (
    id_user INT,
    id_event INT,
    PRIMARY KEY (id_user, id_event),
    FOREIGN KEY (id_user)
        REFERENCES users(id_user)
        ON DELETE CASCADE,
    FOREIGN KEY (id_event)
        REFERENCES events(id_event)
        ON DELETE CASCADE
);


INSERT INTO events_submit (id_user, id_event)
VALUES 
(4,1),
(5,1),
(4,2),
(5,3);