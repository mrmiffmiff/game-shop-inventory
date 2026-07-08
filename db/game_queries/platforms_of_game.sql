SELECT platforms.id, platforms.platform_name
FROM games
JOIN game_platforms AS gp ON games.id = gp.game_id
JOIN platforms ON gp.platform_id = platforms.id
WHERE games.id = $1
ORDER BY platforms.platform_name;
