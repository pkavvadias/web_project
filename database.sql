DROP DATABASE IF EXISTS webproject;
CREATE DATABASE webproject;

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users
(
username VARCHAR(15) UNIQUE NOT NULL PRIMARY KEY,
password varchar(10) NOT NULL,
email varchar(30) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS har_data;
CREATE TABLE IF NOT EXISTS har_data
(
    username_user VARCHAR NOT NULL,
    starteddatetime TIMESTAMP,
    serveripaddress VARCHAR,
    wait VARCHAR,
    method VARCHAR,
    domain VARCHAR,
    status VARCHAR,
    statustext VARCHAR,
    content_type VARCHAR,
    cache_control VARCHAR,
    pragma VARCHAR,
    expires VARCHAR,
    age VARCHAR,
    last_modified VARCHAR,
    host VARCHAR,
    date TIMESTAMP,
    userip VARCHAR,
    isp VARCHAR,
    city VARCHAR,
    latitude_city  VARCHAR,
    longitude_city VARCHAR,
    FOREIGN KEY (username_user)
    REFERENCES users (username)
   
);