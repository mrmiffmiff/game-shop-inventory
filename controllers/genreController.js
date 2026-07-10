import db from "../db/genre_queries/genre_queries.js";
import { body, validationResult, matchedData } from "express-validator";

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
async function getCreateGenre(req, res) {
    res.render("genreForm", { title: "Create New Genre", header: "Create New Genre", genre: null, genreName: null });
}

const validateGenre = [
    body("genreName").trim().customSanitizer(value => {
        if (!value) return value;
        return value.replace(/[\u2018\u2019\u201A\u201B]/g, "'");
    })
        .notEmpty().withMessage("Genre name cannot be blank.")
        .isAlphanumeric('en-US', {
            ignore: " '-&/"
        }).withMessage("Genre name must contain alphabetic characters, spaces, -, &, ', / only."),
];

const postCreateGenre = [
    validateGenre,
    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async (req, res) => {
        const inputName = req.body.genreName;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("genreForm", { title: "Create New Genre", header: "Create New Genre", genre: null, genreName: inputName, errors: errors.array(), });
        }
        const { genreName } = matchedData(req);
        await db.addNewGenre(genreName);
        res.redirect("/genres");
    }
];

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function getGenre(req, res) {
    const id = Number.parseInt(req.params.id);
    const genreName = await db.getGenreNameById(id);
    const games = await db.getGamesInGenre(id);
    res.render("genre", { name: genreName, title: genreName, games: games, id: id });
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function getEditGenre(req, res) {
    const id = Number.parseInt(req.params.id);
    const genreName = await db.getGenreNameById(id);
    res.render("genreForm", { title: "Edit Genre", header: "Edit Genre", genre: { id: id, genre: genreName }, genreName: genreName });
}

const putEditGenre = [
    validateGenre,
    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async (req, res) => {
        const inputName = req.body.genreName;
        const id = Number.parseInt(req.params.id);
        const oldGenreName = await db.getGenreNameById(id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("genreForm", { title: "Edit Genre", header: "Edit Genre", genre: { id: id, genre: oldGenreName }, genreName: inputName, errors: errors.array(), });
        }
        const { genreName } = matchedData(req);
        await db.updateGenreNameById(id, genreName);
        res.redirect("/genres/" + id);
    }
]

export default {
    getAllGenres,
    getCreateGenre,
    postCreateGenre,
    getEditGenre,
    putEditGenre,
    getGenre
}