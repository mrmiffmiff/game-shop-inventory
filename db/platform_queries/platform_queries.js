import pool from "../pool.js";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} Platform
 * @property {number} id
 * @property {string} platform_name
 * @property {number|null} manufacturer
 */

async function getAllPlatforms() {
    /**
     * @type {import('pg').QueryResult<Platform>}
     */
    const { rows } = await pool.query("SELECT * FROM platforms;");
    return rows;
}

/**
 * @typedef {Object} PlatformWithManufacturer
 * @property {number} id
 * @property {string} platform_name
 * @property {number|null} manufacturer
 * @property {string|null} manufacturer_name
 */

/**
 *
 * @param {number} id
 * @returns
 */
async function getPlatformById(id) {
    /**
     * @type {import('pg').QueryResult<PlatformWithManufacturer>}
     */
    const result = await pool.query(
        `SELECT platforms.id, platforms.platform_name, platforms.manufacturer,
                creators.creator_name AS manufacturer_name
         FROM platforms
         LEFT JOIN creators ON platforms.manufacturer = creators.id
         WHERE platforms.id = $1;`,
        [id]
    );
    return result.rows[0];
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

export default {
    getAllPlatforms,
    getPlatformById,
    getGamesOnPlatform,
};
