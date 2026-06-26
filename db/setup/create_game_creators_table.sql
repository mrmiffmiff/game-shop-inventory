CREATE TYPE creation_type AS ENUM ( 'developer', 'publisher' );

CREATE TABLE IF NOT EXISTS game_creators (
 game_id INTEGER NOT NULL REFERENCES games ( id ),
 creator_id INTEGER NOT NULL REFERENCES creators ( id ),
 role creation_type NOT NULL,
 PRIMARY KEY ( game_id, creator_id, role )
);
