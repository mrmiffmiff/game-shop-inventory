CREATE TABLE IF NOT EXISTS game_creators (
 game_id INTEGER NOT NULL REFERENCES games ( id ) ON DELETE CASCADE,
 creator_id INTEGER NOT NULL REFERENCES creators ( id ) ON DELETE CASCADE,
 PRIMARY KEY ( game_id, creator_id )
);
