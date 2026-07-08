import pool from "../pool.js";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} Game
 * @property {number} id
 * @property {string} game_name
 * @property {number} release_year
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
 * @typedef {Object} CreatorWithRole
 * @property {number} id
 * @property {string} creator_name
 * @property {string} role
 */

async function getCreatorsOfGame(id) {
    /**
     * @type {import('pg').QueryResult<CreatorWithRole>}
     */
    const result = await pool.query(CREATORS_OF_GAME_SQL, [id]);
    return result.rows;
}

export default {
    getAllGames,
    getGameById,
    getGenresOfGame,
    getPlatformsOfGame,
    getCreatorsOfGame,
}