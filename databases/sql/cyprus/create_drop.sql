/*
This code defines the "create-drop" script for the CYPRUS database.
*/

/* DROP */
DROP TABLE IF EXISTS AcademyKVPair;
DROP TABLE IF EXISTS KingdomKVPair;
DROP TABLE IF EXISTS Patent;
DROP TABLE IF EXISTS Department;
DROP TABLE IF EXISTS Faculty;
DROP TABLE IF EXISTS Manor;
DROP TABLE IF EXISTS Barony;
DROP TABLE IF EXISTS County;
DROP TABLE IF EXISTS Duchy;
DROP TABLE IF EXISTS Holds;
DROP TABLE IF EXISTS Accolade;
DROP TABLE IF EXISTS Chivalric;
DROP TABLE IF EXISTS Person;
DROP TABLE IF EXISTS RankTier;

/* CREATE */
CREATE TABLE RankTier (
    tier INTEGER PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Ranker',
    name_female TEXT NOT NULL DEFAULT 'Rankeress',
    royal_home_guard TEXT,
    usa_equivalent TEXT
);

CREATE TABLE Person (
    code TEXT PRIMARY KEY,
    rank_tier INTEGER NOT NULL DEFAULT 1,
    posthumous_tier INTEGER,
    short_title TEXT NOT NULL DEFAULT 'Person',
    shortish_title TEXT,
    style TEXT,
    is_male INTEGER NOT NULL DEFAULT TRUE,
    addressed_as TEXT,
    cyprian_legal_name TEXT,
    bio TEXT NOT NULL DEFAULT 'is a person.',
    arms TEXT,
    known_as TEXT,
    surname TEXT,
    forename TEXT,
    family TEXT,
    FOREIGN KEY(rank_tier) REFERENCES RankTier(tier)
);

CREATE TABLE Chivalric (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Chivalric Order',
    style TEXT,
    master TEXT,
    arms TEXT,
    description TEXT NOT NULL DEFAULT 'The <strong>Chivalric Order</strong> is a chivalric order.',
    seniority INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(master) REFERENCES Person(code)
);

CREATE TABLE Accolade (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Accolade',
    chivalric TEXT NOT NULL DEFAULT 'cross',
    tier INTEGER NOT NULL DEFAULT 0,
    precedence INTEGER,
    FOREIGN KEY(chivalric) REFERENCES Chivalric(code)
);

CREATE TABLE Holds (
    person TEXT,
    accolade TEXT,
    PRIMARY KEY(person, accolade),
    FOREIGN KEY(person) REFERENCES Person(code),
    FOREIGN KEY(accolade) REFERENCES Accolade(code) 
);

CREATE TABLE Duchy (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Duchy of Ducania',
    duke TEXT,
    lord_warden TEXT,
    arms TEXT,
    description TEXT,
    seniority INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(duke) REFERENCES Person(code),
    FOREIGN KEY(lord_warden) REFERENCES Person(code)
);

CREATE TABLE County (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'County of Comitania',
    duchy TEXT NOT NULL DEFAULT 'nicosia',
    earl TEXT,
    lord_lieutenant TEXT,
    arms TEXT,
    description TEXT,
    seniority INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(duchy) REFERENCES Duchy(code),
    FOREIGN KEY(earl) REFERENCES Person(code),
    FOREIGN KEY(lord_lieutenant) REFERENCES Person(code)
);

CREATE TABLE Barony (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Barony of Baronia',
    county TEXT NOT NULL DEFAULT 'nicosia',
    baron TEXT,
    knight_lieutenant TEXT,
    arms TEXT,
    description TEXT,
    seniority INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(county) REFERENCES County(code),
    FOREIGN KEY(baron) REFERENCES Person(code),
    FOREIGN KEY(knight_lieutenant) REFERENCES Person(code)
);

CREATE TABLE Manor (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Manor of Manoria',
    barony TEXT NOT NULL DEFAULT 'nicosia',
    master TEXT,
    arms TEXT,
    description TEXT,
    seniority INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(barony) REFERENCES Barony(code),
    FOREIGN KEY(master) REFERENCES Person(code)
);

CREATE TABLE Faculty (
    code TEXT PRIMARY KEY,
    name TEXT DEFAULT 'Faculty of General Studies',
    pro_vice_chancellor TEXT,
    arms TEXT,
    description TEXT,
    FOREIGN KEY(pro_vice_chancellor) REFERENCES Person(code)
);

CREATE TABLE Department (
    code TEXT PRIMARY KEY,
    name TEXT DEFAULT 'Department of General Studies',
    professor TEXT,
    faculty TEXT,
    arms TEXT,
    description TEXT,
    FOREIGN KEY(professor) REFERENCES Person(code),
    FOREIGN KEY(faculty) REFERENCES Faculty(code)
);

CREATE TABLE Patent (
    num INTEGER PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Patent',
    day INTEGER NOT NULL DEFAULT 1,
    month INTEGER NOT NULL DEFAULT 1,
    monarch_cypher TEXT NOT NULL DEFAULT 'T',
    monarch_year INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE KingdomKVPair (
    key TEXT PRIMARY KEY,
    val TEXT
);

CREATE TABLE AcademyKVPair (
    key TEXT PRIMARY KEY,
    val TEXT
);
