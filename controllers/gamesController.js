import db from "../db/game_queries/game_queries.js";
import genreDb from "../db/genre_queries/genre_queries.js";
import platformDb from "../db/platform_queries/platform_queries.js";
import creatorDb from "../db/creator_queries/creator_queries.js";
import { body, validationResult, matchedData } from "express-validator";

function toArray(v) {
    if (v == null) return [];
    return Array.isArray(v) ? v : [v];
}

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

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getEditGameGenres(req, res) {
    const id = Number.parseInt(req.params.id);
    const game = await db.getGameById(id);
    const allGenres = await genreDb.getAllGenres();
    const currentGenres = await db.getGenresOfGame(id);
    res.render("gameAssociationForm", {
        title: `Edit Genres for ${game.game_name}`, game, kind: "genres",
        idField: "genreId", allItems: allGenres, labelField: "genre",
        currentIds: currentGenres.map(g => g.id), actionUrl: `/games/${id}/genres/edit`,
    });
}

const validateGenreIds = [
    body("genreId").customSanitizer(toArray),
    body("genreId.*").isInt().toInt(),
];

const putEditGameGenres = [
    validateGenreIds,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const game = await db.getGameById(id);
            const allGenres = await genreDb.getAllGenres();
            return res.status(400).render("gameAssociationForm", {
                title: `Edit Genres for ${game.game_name}`, game, kind: "genres",
                idField: "genreId", allItems: allGenres, labelField: "genre",
                currentIds: toArray(req.body.genreId).map(Number),
                actionUrl: `/games/${id}/genres/edit`, errors: errors.array(),
            });
        }
        const { genreId } = matchedData(req);
        await db.setGameGenres(id, genreId);
        res.redirect(`/games/${id}`);
    }
];

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getEditGamePlatforms(req, res) {
    const id = Number.parseInt(req.params.id);
    const game = await db.getGameById(id);
    const allPlatforms = await platformDb.getAllPlatforms();
    const currentPlatforms = await db.getPlatformsOfGame(id);
    res.render("gameAssociationForm", {
        title: `Edit Platforms for ${game.game_name}`, game, kind: "platforms",
        idField: "platformId", allItems: allPlatforms, labelField: "platform_name",
        currentIds: currentPlatforms.map(p => p.id), actionUrl: `/games/${id}/platforms/edit`,
    });
}

const validatePlatformIds = [
    body("platformId").customSanitizer(toArray),
    body("platformId.*").isInt().toInt(),
];

const putEditGamePlatforms = [
    validatePlatformIds,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const game = await db.getGameById(id);
            const allPlatforms = await platformDb.getAllPlatforms();
            return res.status(400).render("gameAssociationForm", {
                title: `Edit Platforms for ${game.game_name}`, game, kind: "platforms",
                idField: "platformId", allItems: allPlatforms, labelField: "platform_name",
                currentIds: toArray(req.body.platformId).map(Number),
                actionUrl: `/games/${id}/platforms/edit`, errors: errors.array(),
            });
        }
        const { platformId } = matchedData(req);
        await db.setGamePlatforms(id, platformId);
        res.redirect(`/games/${id}`);
    }
];

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getEditGameCreators(req, res) {
    const id = Number.parseInt(req.params.id);
    const game = await db.getGameById(id);
    const allCreators = await creatorDb.getAllCreators();
    const currentCreators = await db.getCreatorsOfGame(id);
    res.render("gameAssociationForm", {
        title: `Edit Creators for ${game.game_name}`, game, kind: "creators",
        idField: "creatorId", allItems: allCreators, labelField: "creator_name",
        currentIds: currentCreators.map(c => c.id), actionUrl: `/games/${id}/creators/edit`,
    });
}

const validateCreatorIds = [
    body("creatorId").customSanitizer(toArray),
    body("creatorId.*").isInt().toInt(),
];

const putEditGameCreators = [
    validateCreatorIds,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const game = await db.getGameById(id);
            const allCreators = await creatorDb.getAllCreators();
            return res.status(400).render("gameAssociationForm", {
                title: `Edit Creators for ${game.game_name}`, game, kind: "creators",
                idField: "creatorId", allItems: allCreators, labelField: "creator_name",
                currentIds: toArray(req.body.creatorId).map(Number),
                actionUrl: `/games/${id}/creators/edit`, errors: errors.array(),
            });
        }
        const { creatorId } = matchedData(req);
        await db.setGameCreators(id, creatorId);
        res.redirect(`/games/${id}`);
    }
];

export default {
    getAllGames,
    getCreateGame,
    postCreateGame,
    getEditGame,
    putEditGame,
    getGame,
    getEditGameGenres,
    putEditGameGenres,
    getEditGamePlatforms,
    putEditGamePlatforms,
    getEditGameCreators,
    putEditGameCreators,
}