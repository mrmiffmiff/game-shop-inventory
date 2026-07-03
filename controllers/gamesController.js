import db from "../db/game_queries/game_queries.js";

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function getAllGames(req, res) {
    const games = await db.getAllGames();
    res.render("games", { title: "All Games", games: games });
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function getGame(req, res) {
    const id = Number.parseInt(req.params.id);
    const game = await db.getGameById(id);
    const genres = await db.getGenresOfGame(id);
    res.render("game", { title: game.game_name, game: game, genres: genres });
}

export default {
    getAllGames,
    getGame
}