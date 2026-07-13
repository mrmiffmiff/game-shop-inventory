import pool from "../pool.js";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} Game
 * @property {number} id
 * @property {string} game_name
 * @property {number} release_year
 * @property {number} quantity
 */

async function getAllGames() {
    /**
     * @type {import('pg').QueryResult<Game>}
     */
    const { rows } = await pool.query("SELECT * FROM games ORDER BY release_year;");
    return rows;
}

/**
 * 
 * @param {number} id 
 * @returns
 */
async function getGameById(id) {
    /**
     * @type {import('pg').QueryResult<Game>}
     */
    const result = await pool.query("SELECT * FROM games WHERE id = $1;", [id]);
    return result.rows[0];
}

async function addNewGame(name, releaseYear, quantity) {
    const addGameSQL = "INSERT INTO games (game_name, release_year, quantity) VALUES ($1, $2, $3);";
    await pool.query(addGameSQL, [name, releaseYear, quantity]);
}

async function updateGameById(id, name, releaseYear, quantity) {
    const updateSQL = "UPDATE games SET game_name = $1, release_year = $2, quantity = $3 WHERE id = $4;";
    await pool.query(updateSQL, [name, releaseYear, quantity, id]);
}

const genres_of_game_path = path.join(import.meta.dirname, 'genres_of_game.sql');
const GENRES_OF_GAME_SQL = readFileSync(genres_of_game_path, 'utf8');

/**
 * @typedef {Object} Genre
 * @property {number} id
 * @property {string} genre
 */

async function getGenresOfGame(id) {
    /**
     * @type {import('pg').QueryResult<Genre>}
     */
    const result = await pool.query(GENRES_OF_GAME_SQL, [id]);
    return result.rows;
}

const platforms_of_game_path = path.join(import.meta.dirname, 'platforms_of_game.sql');
const PLATFORMS_OF_GAME_SQL = readFileSync(platforms_of_game_path, 'utf8');

/**
 * @typedef {Object} Platform
 * @property {number} id
 * @property {string} platform_name
 */

async function getPlatformsOfGame(id) {
    /**
     * @type {import('pg').QueryResult<Platform>}
     */
    const result = await pool.query(PLATFORMS_OF_GAME_SQL, [id]);
    return result.rows;
}

const creators_of_game_path = path.join(import.meta.dirname, 'creators_of_game.sql');
const CREATORS_OF_GAME_SQL = readFileSync(creators_of_game_path, 'utf8');

/**
 * @typedef {Object} Creator
 * @property {number} id
 * @property {string} creator_name
 */

async function getCreatorsOfGame(id) {
    /**
     * @type {import('pg').QueryResult<Creator>}
     */
    const result = await pool.query(CREATORS_OF_GAME_SQL, [id]);
    return result.rows;
}

export default {
    getAllGames,
    getGameById,
    addNewGame,
    updateGameById,
    getGenresOfGame,
    getPlatformsOfGame,
    getCreatorsOfGame,
}