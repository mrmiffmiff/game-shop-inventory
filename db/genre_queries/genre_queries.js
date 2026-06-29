import pool from "../pool.js";
import { readFileSync } from "node:fs";
import path from "node:path";

async function getAllGenres() {
    const { rows } = await pool.query("SELECT * FROM genres;");
    return rows;
}

/**
 * @typedef {Object} Genre
 * @property {number} id
 * @property {string} genre
 */

/**
 * 
 * @param {number} id 
 * @returns
 */
async function getGenreNameById(id) {
    /**
     * @type {import('pg').QueryResult<Genre>}
     */
    const result = await pool.query("SELECT genre FROM genres WHERE id = $1;", id);
    return result.rows[0].genre;
}

const games_by_genre_path = path.join(import.meta.dirname, 'games_by_genre.sql');
const GAMES_BY_GENRE_SQL = readFileSync(games_by_genre_path, 'utf8');

/**
 * @typedef {Object} Game
 * @property {number} id
 * @property {string} game_name
 * @property {number} release_year
 */

async function getGamesInGenre(id) {
    /**
     * @type {import('pg').QueryResult<Game>}
     */
    const result = await pool.query(GAMES_BY_GENRE_SQL, id);
    return result.rows;
}

export default {
    getAllGenres,
    getGenreNameById,
    getGamesInGenre,
};