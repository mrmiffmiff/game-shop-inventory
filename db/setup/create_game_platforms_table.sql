CREATE TABLE IF NOT EXISTS game_platforms (
 game_id INTEGER NOT NULL REFERENCES games ( id ),
 platform_id INTEGER NOT NULL REFERENCES platforms ( id ),
 PRIMARY KEY ( game_id, platform_id )
);
