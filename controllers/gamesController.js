import db from "../db/game_queries/game_queries.js";
import { body, validationResult, matchedData } from "express-validator";

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
async function getCreateGame(req, res) {
    res.render("gameForm", { title: "Create New Game", header: "Create New Game", game: null, gameName: null, releaseYear: null, quantity: 0 });
}

const validateGame = [
    body("gameName").trim().customSanitizer(value => {
        if (!value) return value;
        return value
            .replace(/[‘’‚‛]/g, "'")
            .replace(/[“”„‟]/g, '"');
    })
        .notEmpty().withMessage("Game name cannot be blank."),
    body("releaseYear").trim().optional({ checkFalsy: true })
        .isInt({ min: 1900 }).withMessage("Release year must be a number no earlier than 1900.")
        .toInt(),
    body("quantity").trim()
        .isInt({ min: 0 }).withMessage("Quantity must be a whole number no less than 0.")
        .toInt(),
];

const postCreateGame = [
    validateGame,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const inputName = req.body.gameName;
        const inputYear = req.body.releaseYear;
        const inputQuantity = req.body.quantity;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("gameForm", { title: "Create New Game", header: "Create New Game", game: null, gameName: inputName, releaseYear: inputYear, quantity: inputQuantity, errors: errors.array(), });
        }
        const { gameName, releaseYear, quantity } = matchedData(req);
        await db.addNewGame(gameName, releaseYear ?? null, quantity);
        res.redirect("/games");
    }
];

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getGame(req, res) {
    const id = Number.parseInt(req.params.id);
    const game = await db.getGameById(id);
    const genres = await db.getGenresOfGame(id);
    const platforms = await db.getPlatformsOfGame(id);
    const creators = await db.getCreatorsOfGame(id);
    res.render("game", { title: game.game_name, game: game, genres: genres, platforms: platforms, creators: creators });
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getEditGame(req, res) {
    const id = Number.parseInt(req.params.id);
    const game = await db.getGameById(id);
    res.render("gameForm", { title: "Edit Game", header: "Edit Game", game: game, gameName: game.game_name, releaseYear: game.release_year, quantity: game.quantity });
}

const putEditGame = [
    validateGame,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const inputName = req.body.gameName;
        const inputYear = req.body.releaseYear;
        const inputQuantity = req.body.quantity;
        const id = Number.parseInt(req.params.id);
        const oldGame = await db.getGameById(id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("gameForm", { title: "Edit Game", header: "Edit Game", game: oldGame, gameName: inputName, releaseYear: inputYear, quantity: inputQuantity, errors: errors.array(), });
        }
        const { gameName, releaseYear, quantity } = matchedData(req);
        await db.updateGameById(id, gameName, releaseYear ?? null, quantity);
        res.redirect("/games/" + id);
    }
]

export default {
    getAllGames,
    getCreateGame,
    postCreateGame,
    getEditGame,
    putEditGame,
    getGame
}