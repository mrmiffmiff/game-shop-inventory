SELECT games.id, games.game_name, games.release_year, gc.role
FROM creators
JOIN game_creators AS gc ON creators.id = gc.creator_id
JOIN games ON gc.game_id = games.id
WHERE creators.id = $1
ORDER BY games.release_year;
