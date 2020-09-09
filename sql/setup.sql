DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS whiskeys;
DROP TABLE IF EXISTS mugs;

CREATE TABLE books (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    pages INTEGER NOT NULL
);

CREATE TABLE cars (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL
);

CREATE TABLE games (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    num_of_players INT CHECK (num_of_players > 0)
);

CREATE TABLE whiskeys (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    brand TEXT NOT NULL,
    type TEXT NOT NULL,
    price INTEGER NOT NULL
);

CREATE TABLE mugs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    made_by TEXT NOT NULL,
    color TEXT NOT NULL,
    favorite_level INTEGER NOT NULL
);