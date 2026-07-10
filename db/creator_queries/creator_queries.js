import pool from "../pool.js";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} Creator
 * @property {number} id
 * @property {string} creator_name
 * @property {number|null} founding_year
 * @property {string|null} country
 * @property {string|null} website
 * @property {string} type
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

async function getCreatorTypes() {
    const result = await pool.query("SELECT unnest(enum_range(NULL::creator_type))::text AS type;");
    return result.rows.map(row => row.type);
}

async function addNewCreator(name, foundingYear, country, website, type) {
    const addCreatorSQL = "INSERT INTO creators (creator_name, founding_year, country, website, type) VALUES ($1, $2, $3, $4, $5);";
    await pool.query(addCreatorSQL, [name, foundingYear, country, website, type]);
}

async function updateCreatorById(id, name, foundingYear, country, website, type) {
    const updateSQL = "UPDATE creators SET creator_name = $1, founding_year = $2, country = $3, website = $4, type = $5 WHERE id = $6;";
    await pool.query(updateSQL, [name, foundingYear, country, website, type, id]);
}

const games_by_creator_path = path.join(import.meta.dirname, 'games_by_creator.sql');
const GAMES_BY_CREATOR_SQL = readFileSync(games_by_creator_path, 'utf8');

/**
 * @typedef {Object} GameWithRole
 * @property {number} id
 * @property {string} game_name
 * @property {number} release_year
 * @property {string} role
 */

async function getGamesByCreator(id) {
    /**
     * @type {import('pg').QueryResult<GameWithRole>}
     */
    const result = await pool.query(GAMES_BY_CREATOR_SQL, [id]);
    return result.rows;
}

export default {
    getAllCreators,
    getCreatorById,
    getCreatorTypes,
    addNewCreator,
    updateCreatorById,
    getGamesByCreator,
};
