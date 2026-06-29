SELECT games.id, games.game_name, games.release_year
FROM genres
JOIN game_genres AS gg ON genres.id = gg.genre_id
JOIN games ON gg.game_id = games.id
WHERE genres.id = $1
ORDER BY games.release_year;