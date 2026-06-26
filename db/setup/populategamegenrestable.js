#! /usr/bin/env node

import { Client } from "pg";
import { argv } from "node:process";
import { readFileSync } from "node:fs";
import path from "node:path";

const create_game_genres_table_path = path.join(import.meta.dirname, 'create_game_genres_table.sql');
const CREATE_GAME_GENRES_TABLE_SQL = readFileSync(create_game_genres_table_path, 'utf8');

const gameGenresToInsert = [
    { game_id: 1, genre_id: 2 }, // Pong -> Arcade
    { game_id: 2, genre_id: 1 }, // pedit5/The Dungeon -> RPG
    { game_id: 2, genre_id: 3 }, // pedit5/The Dungeon -> Dungeon Crawler
    { game_id: 3, genre_id: 1 }, // dnd/The Game of Dungeons -> RPG
    { game_id: 3, genre_id: 3 }, // dnd/The Game of Dungeons -> Dungeon Crawler
    { game_id: 4, genre_id: 2 }, // Space Invaders -> Arcade
];
const gameGenreSqlParameters = [];
const placeholders = gameGenresToInsert.map((row, i) => {
    gameGenreSqlParameters.push(row.game_id, row.genre_id);
    return `($${i * 2 + 1}, $${i * 2 + 2})`;
});
const POPULATE_GAME_GENRES_TABLE_SQL = `INSERT INTO game_genres (game_id, genre_id) VALUES ${placeholders.join(', ')}`;

const getArg = (name) => {
    const arg = argv.find(a => a.startsWith(`--${name}=`));
    return arg ? arg.split('=')[1] : process.env[`PG${name.toUpperCase()}`];
};

const host = getArg('host');
const database = getArg('database');
const role = getArg('user');
const pass = getArg('password');

async function main() {
    console.log(`seeding to ${host}...`);
    const client = new Client({
        host: host,
        database: database,
        user: role,
        password: pass,
    });
    try {
        await client.connect();
        await client.query(CREATE_GAME_GENRES_TABLE_SQL);
        await client.query(POPULATE_GAME_GENRES_TABLE_SQL, gameGenreSqlParameters);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
    console.log("done");
}

await main();
