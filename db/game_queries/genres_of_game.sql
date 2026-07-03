SELECT genres.id, genres.genre
FROM games
JOIN game_genres AS gg ON games.id = gg.game_id
JOIN genres ON gg.genre_id = genres.id
WHERE games.id = $1
ORDER BY genres.genre;