SELECT creators.id, creators.creator_name
FROM games
JOIN game_creators AS gc ON games.id = gc.game_id
JOIN creators ON gc.creator_id = creators.id
WHERE games.id = $1
ORDER BY creators.creator_name;
