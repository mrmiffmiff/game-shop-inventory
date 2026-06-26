CREATE TABLE IF NOT EXISTS game_genres (
 game_id INTEGER NOT NULL REFERENCES games ( id ),
 genre_id INTEGER NOT NULL REFERENCES genres ( id ),
 PRIMARY KEY ( game_id, genre_id )
);
