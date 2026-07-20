import pool from "../pool.js";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} Platform
 * @property {number} id
 * @property {string} platform_name
 */

async function getAllPlatforms() {
    /**
     * @type {import('pg').QueryResult<Platform>}
     */
    const { rows } = await pool.query("SELECT * FROM platforms;");
    return rows;
}

/**
 *
 * @param {number} id
 * @returns
 */
async function getPlatformById(id) {
    /**
     * @type {import('pg').QueryResult<Platform>}
     */
    const result = await pool.query("SELECT * FROM platforms WHERE id = $1;", [id]);
    return result.rows[0];
}

async function addNewPlatform(name) {
    const addPlatformSQL = "INSERT INTO platforms (platform_name) VALUES ($1);";
    await pool.query(addPlatformSQL, [name]);
}

async function updatePlatformById(id, name) {
    const updateSQL = "UPDATE platforms SET platform_name = $1 WHERE id = $2;";
    await pool.query(updateSQL, [name, id]);
}

const games_by_platform_path = path.join(import.meta.dirname, 'games_by_platform.sql');
const GAMES_BY_PLATFORM_SQL = readFileSync(games_by_platform_path, 'utf8');

/**
 * @typedef {Object} Game
 * @property {number} id
 * @property {string} game_name
 * @property {number} release_year
 */

async function getGamesOnPlatform(id) {
    /**
     * @type {import('pg').QueryResult<Game>}
     */
    const result = await pool.query(GAMES_BY_PLATFORM_SQL, [id]);
    return result.rows;
}

async function deletePlatformById(id) {
    await pool.query("DELETE FROM platforms WHERE id = $1;", [id]);
}

export default {
    getAllPlatforms,
    getPlatformById,
    addNewPlatform,
    updatePlatformById,
    getGamesOnPlatform,
    deletePlatformById,
};
