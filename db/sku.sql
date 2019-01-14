-- Run this file with psql -f sku.sql. Only run this once to set up database.
DROP DATABASE IF EXISTS SKU_MGMT;
CREATE DATABASE SKU_MGMT;
-- connect to postgres database SKU_MGMT- can't just use db like in MYSQL
\c sku_mgmt;

CREATE TABLE Ingredients (
    NAME TEXT UNIQUE PRIMARY KEY NOT NULL,
    -- Serial type uses auto incrementing if value not supplied, otherwise uses user-inputted value
    NUM SERIAL UNIQUE NOT NULL,
    VEND_INFO TEXT NULL,
    PKG_SIZE VARCHAR(100) NOT NULL,
    PKG_COST DECIMAL NOT NULL CHECK (PKG_COST > 0), 
    COMMENTS TEXT NULL
);

CREATE TABLE ProductLine (
    NAME TEXT UNIQUE PRIMARY KEY NOT NULL
);

CREATE TABLE SKU (
    NAME VARCHAR(32) NOT NULL,
    NUM SERIAL UNIQUE PRIMARY KEY NOT NULL, 
    CASE_UPC BIGINT UNIQUE NOT NULL,
    -- not sure why unit upc is not necessarily unique
    UNIT_UPC BIGINT NOT NULL,
    UNIT_SIZE TEXT NOT NULL,
    COUNT_PER_CASE INT NOT NULL CHECK (COUNT_PER_CASE > 0),
    -- If ProductLine changes, change everything in this database accordingly
    PRD_LINE TEXT REFERENCES ProductLine(NAME) ON DELETE CASCADE ON UPDATE CASCADE,
    COMMENTS TEXT NULL
);

CREATE TABLE SKU_INGRED (
    SKU_NUM INT REFERENCES SKU(NUM) ON DELETE CASCADE ON UPDATE CASCADE,
    INGRED_NUM INT REFERENCES Ingredients(NUM) ON DELETE CASCADE ON UPDATE CASCADE,
    QUANTITY INT NOT NULL
);
