SELECT games.id, games.game_name, games.release_year
FROM platforms
JOIN game_platforms AS gp ON platforms.id = gp.platform_id
JOIN games ON gp.game_id = games.id
WHERE platforms.id = $1
ORDER BY games.release_year;
