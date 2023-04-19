/*
This code inserts some basic data into a database which is assumed to be empty.
*/

INSERT INTO RankTier (tier, name, name_female, royal_home_guard, usa_equivalent)
VALUES
    (0, 'None (dead)', 'None (dead)', NULL, NULL),
    (1, 'Villein', 'Villeiness', 'Conscript', 'PV1'),
    (2, 'Ploughman', 'Ploughman''s Wife', 'Private', 'PV2'),
    (3, 'Journeyman', 'Journeyman''s Wife', 'Lance Corporal', 'PFC'),
    (4, 'Foreman', 'Foreman''s Wife', 'Corporal', 'CPL'),
    (5, 'Master Craftsman', 'Craftmistress', 'Lance Sergeant', 'SGT'),
    (6, 'Bailiff', 'Bailiff''s Wife', 'Sergeant', 'SSG'),
    (7, 'Grand Master Craftsman', 'Grand Craftmistress', 'Warrant Officer', 'SGM'),
    (8, 'Goodman', 'Goodman''s Wife', 'Lieutenant', '1LT'),
    (9, 'Yeoman', 'Yeoman''s Wife', 'Captain', 'CPT'),
    (10, 'Gentleman', 'Chateleine', 'Major', 'MAJ'),
    (11, 'Vice-Master', 'Vice-Mistress', 'Lieutenant Colonel', 'LTC'),
    (12, 'Master', 'Mistress', 'Colonel', 'COL'),
    (13, 'Knight', 'Knight''s Wife', 'Brevet Brigadier General', 'COL'),
    (14, 'Baron', 'Baroness', 'Brigadier General', 'BG'),
    (15, 'Viscount', 'Viscountess', 'Brevet Major General', 'BG'),
    (16, 'Earl', 'Countess', 'Major General', 'MG'),
    (17, 'Marquess', 'Marchioness', 'Brevet Lieutenant General', 'MG'),
    (18, 'Duke', 'Duchess', 'Lieutenant General', 'LG'),
    (19, 'Viceroy', 'Vicereine', NULL, 'LG'),
    (20, 'King in Ordinary', 'Queen in Ordinary', 'General', 'GEN'),
    (21, 'King Imperial', 'Queen Imperial', NULL, 'GA'),
    (22, 'King Celestial', 'Queen Celestial', NULL, 'GAS'),
    (23, 'King Ethereal', 'Queen Ethereal', NULL, NULL),
    (24, 'King Eternal', 'Queen Eternal', NULL, NULL);

INSERT INTO Person (code, rank_tier, posthumous_tier, short_title, shortish_title, style, is_male, addressed_as, cyprian_legal_name, bio, arms, known_as, surname, forename, family)
VALUES
    ('rex', 20, NULL, 'The King', 'His Majesty The King', 'His Majesty', TRUE, 'Your Majesty', 'His Majesty The King', 'is head of state of the Kingdom. The post is currently vacant.', 'arms_royal.svg', NULL, NULL, NULL, NULL);

INSERT INTO Chivalric (code, name, style, master, arms, description, seniority)
VALUES
    ('cross', 'Order of the Cross', 'The Most Noble', 'rex', 'arms_order_cross.svg', 'The Most Noble <strong>Order of the Cross</strong> is the oldest and most senior of the Kingdom''s chivalric orders.', 1);

INSERT INTO Accolade (code, name, chivalric, tier, precedence)
VALUES
    ('kc', 'Knight of the Most Noble Order of the Cross', 'cross', 5, NULL);

INSERT INTO Holds (person, accolade)
VALUES
    ('rex', 'kc');

INSERT INTO Duchy (code, name, duke, lord_warden, arms, description, seniority)
VALUES
    ('nicosia', 'Duchy of Nicosia', NULL, NULL, 'arms_duchy_nicosia.svg', NULL, 1);

INSERT INTO County (code, name, duchy, earl, lord_lieutenant, arms, description, seniority)
VALUES
    ('nicosia', 'County of Nicosia', 'nicosia', NULL, NULL, 'arms_county_nicosia.svg', NULL, 1);

INSERT INTO Barony (code, name, county, baron, knight_lieutenant, arms, description, seniority)
VALUES
    ('nicosia', 'Barony of Nicosia', 'nicosia', NULL, NULL, 'arms_barony_nicosia.svg', NULL, 1);

INSERT INTO Manor (code, name, barony, master, arms, description, seniority)
VALUES
    ('nicosia', 'Manor of Nicosia', 'nicosia', NULL, 'arms_barony_nicosia.svg', NULL, 1);
