DROP DATABASE IF EXISTS SKU_MGMT;
DROP TABLE IF EXISTS ProductLine CASCADE;
DROP TABLE IF EXISTS Ingredients;
DROP TABLE IF EXISTS SKU;
CREATE DATABASE SKU_MGMT;
\c sku_mgmt;

CREATE TABLE Ingredients (
    NAME TEXT UNIQUE PRIMARY KEY NOT NULL,
    NUM INT UNIQUE NOT NULL,
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
    NUM INT UNIQUE PRIMARY KEY NOT NULL, 
    CASE_UPC BIGINT UNIQUE NOT NULL,
    UNIT_UPC BIGINT NOT NULL,
    UNIT_SIZE TEXT NOT NULL,
    COUNT_PER_CASE INT NOT NULL CHECK (COUNT_PER_CASE > 0),
    PRD_LINE TEXT REFERENCES ProductLine(NAME) ON DELETE CASCADE ON UPDATE CASCADE,
    COMMENTS TEXT NULL
);

CREATE TABLE SKU_INGRED (
    SKU_NUM INT REFERENCES SKU(NUM) ON DELETE CASCADE,
    INGRED_NUM INT REFERENCES Ingredients(NUM) ON DELETE CASCADE,
    QUANTITY INT NOT NULL


);
