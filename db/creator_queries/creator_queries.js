import pool from "../pool.js";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} Creator
 * @property {number} id
 * @property {string} creator_name
 * @property {string|null} country
 */

async function getAllCreators() {
    /**
     * @type {import('pg').QueryResult<Creator>}
     */
    const { rows } = await pool.query("SELECT * FROM creators;");
    return rows;
}

/**
 *
 * @param {number} id
 * @returns
 */
async function getCreatorById(id) {
    /**
     * @type {import('pg').QueryResult<Creator>}
     */
    const result = await pool.query("SELECT * FROM creators WHERE id = $1;", [id]);
    return result.rows[0];
}

async function addNewCreator(name, country) {
    const addCreatorSQL = "INSERT INTO creators (creator_name, country) VALUES ($1, $2);";
    await pool.query(addCreatorSQL, [name, country]);
}

async function updateCreatorById(id, name, country) {
    const updateSQL = "UPDATE creators SET creator_name = $1, country = $2 WHERE id = $3;";
    await pool.query(updateSQL, [name, country, id]);
}

const games_by_creator_path = path.join(import.meta.dirname, 'games_by_creator.sql');
const GAMES_BY_CREATOR_SQL = readFileSync(games_by_creator_path, 'utf8');

/**
 * @typedef {Object} Game
 * @property {number} id
 * @property {string} game_name
 * @property {number} release_year
 */

async function getGamesByCreator(id) {
    /**
     * @type {import('pg').QueryResult<Game>}
     */
    const result = await pool.query(GAMES_BY_CREATOR_SQL, [id]);
    return result.rows;
}

export default {
    getAllCreators,
    getCreatorById,
    addNewCreator,
    updateCreatorById,
    getGamesByCreator,
};
