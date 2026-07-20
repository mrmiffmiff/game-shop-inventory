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
 * @param {Object} filters
 * @param {string} [filters.search]
 * @param {number[]} [filters.genreIds]
 * @param {number[]} [filters.platformIds]
 * @param {number[]} [filters.creatorIds]
 */
async function getFilteredGames({ search, genreIds = [], platformIds = [], creatorIds = [] }) {
    let query = "SELECT * FROM games g WHERE 1=1";
    const params = [];
    if (search) {
        params.push(`%${search}%`);
        query += ` AND g.game_name ILIKE $${params.length}`;
    }
    if (genreIds.length) {
        params.push(genreIds);
        query += ` AND g.id IN (SELECT game_id FROM game_genres WHERE genre_id = ANY($${params.length}::int[]))`;
    }
    if (platformIds.length) {
        params.push(platformIds);
        query += ` AND g.id IN (SELECT game_id FROM game_platforms WHERE platform_id = ANY($${params.length}::int[]))`;
    }
    if (creatorIds.length) {
        params.push(creatorIds);
        query += ` AND g.id IN (SELECT game_id FROM game_creators WHERE creator_id = ANY($${params.length}::int[]))`;
    }
    query += " ORDER BY g.release_year;";
    /**
     * @type {import('pg').QueryResult<Game>}
     */
    const { rows } = await pool.query(query, params);
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

/**
 * Applies an add/remove diff to a game's junction-table associations inside an existing transaction.
 * `table`/`column` must always be hardcoded literals from the wrapper functions below, never derived
 * from request data, since they are interpolated directly into the SQL.
 * @param {import('pg').PoolClient} client
 * @param {string} table
 * @param {string} column
 * @param {number} gameId
 * @param {number[]} selectedIds
 */
async function syncGameAssociations(client, table, column, gameId, selectedIds) {
    const { rows } = await client.query(
        `SELECT ${column} FROM ${table} WHERE game_id = $1`, [gameId]
    );
    const currentIds = rows.map(r => r[column]);
    const toAdd = selectedIds.filter(id => !currentIds.includes(id));
    const toRemove = currentIds.filter(id => !selectedIds.includes(id));
    if (toAdd.length) {
        await client.query(
            `INSERT INTO ${table} (game_id, ${column}) SELECT $1, unnest($2::int[])`,
            [gameId, toAdd]
        );
    }
    if (toRemove.length) {
        await client.query(
            `DELETE FROM ${table} WHERE game_id = $1 AND ${column} = ANY($2::int[])`,
            [gameId, toRemove]
        );
    }
}

/**
 * @param {number} gameId
 * @param {number[]} genreIds
 */
async function setGameGenres(gameId, genreIds) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await syncGameAssociations(client, 'game_genres', 'genre_id', gameId, genreIds);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/**
 * @param {number} gameId
 * @param {number[]} platformIds
 */
async function setGamePlatforms(gameId, platformIds) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await syncGameAssociations(client, 'game_platforms', 'platform_id', gameId, platformIds);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/**
 * @param {number} gameId
 * @param {number[]} creatorIds
 */
async function setGameCreators(gameId, creatorIds) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await syncGameAssociations(client, 'game_creators', 'creator_id', gameId, creatorIds);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/**
 * @param {{id: number, quantity: number}[]} games
 */
async function updateQuantitiesBulk(games) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const g of games) {
            await client.query('UPDATE games SET quantity = $1 WHERE id = $2', [g.quantity, g.id]);
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function deleteGameById(id) {
    await pool.query("DELETE FROM games WHERE id = $1;", [id]);
}

export default {
    getAllGames,
    getFilteredGames,
    getGameById,
    addNewGame,
    updateGameById,
    updateQuantitiesBulk,
    getGenresOfGame,
    getPlatformsOfGame,
    getCreatorsOfGame,
    setGameGenres,
    setGamePlatforms,
    setGameCreators,
    deleteGameById,
}