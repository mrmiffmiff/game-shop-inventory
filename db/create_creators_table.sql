CREATE TYPE creator_type AS ENUM ('company', 'individual');

CREATE TABLE IF NOT EXISTS creators (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 creator_name VARCHAR ( 255 ) NOT NULL,
 founding_year SMALLINT,
 country VARCHAR ( 255 ),
 website VARCHAR ( 255 ),
 type creator_type NOT NULL
);