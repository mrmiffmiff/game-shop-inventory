import db from "../db/genre_queries/genre_queries.js";

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function getAllGenres(req, res) {
    const genres = await db.getAllGenres();
    res.render("genres", { genres: genres, title: "All Genres" });
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function getGenre(req, res) {
    const id = Number.parseInt(req.query.id);
    const genreName = await db.getGenreNameById(id);
    const games = await db.getGamesInGenre(id);
    res.render("genre", { name: genreName, title: genreName, games: games });
}