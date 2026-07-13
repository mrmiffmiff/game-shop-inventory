CREATE TABLE IF NOT EXISTS game_creators (
 game_id INTEGER NOT NULL REFERENCES games ( id ),
 creator_id INTEGER NOT NULL REFERENCES creators ( id ),
 PRIMARY KEY ( game_id, creator_id )
);
