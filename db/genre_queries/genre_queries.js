import pool from "../pool.js";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} Genre
 * @property {number} id
 * @property {string} genre
 */

async function getAllGenres() {
    /**
     * @type {import('pg').QueryResult<Genre>}
     */
    const { rows } = await pool.query("SELECT * FROM genres;");
    return rows;
}

async function addNewGenre(name) {
    const addGenreSQL = "INSERT INTO genres (genre) VALUES ($1);";
    await pool.query(addGenreSQL, [name]);
}

/**
 * 
 * @param {number} id 
 * @returns
 */
async function getGenreNameById(id) {
    /**
     * @type {import('pg').QueryResult<Genre>}
     */
    const result = await pool.query("SELECT genre FROM genres WHERE id = $1;", [id]);
    return result.rows[0].genre;
}

async function updateGenreNameById(id, name) {
    const updateSQL = "UPDATE genres SET genre = $1 WHERE id = $2;";
    await pool.query(updateSQL, [name, id]);
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
    const result = await pool.query(GAMES_BY_GENRE_SQL, [id]);
    return result.rows;
}

async function deleteGenreById(id) {
    await pool.query("DELETE FROM genres WHERE id = $1;", [id]);
}

export default {
    getAllGenres,
    addNewGenre,
    getGenreNameById,
    updateGenreNameById,
    getGamesInGenre,
    deleteGenreById,
};