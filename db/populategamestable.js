#! /usr/bin/env node

import { Client } from "pg";
import { argv } from "node:process";
import { readFileSync } from "node:fs";
import path from "node:path";

const create_games_table_path = path.join(import.meta.dirname, 'create_games_table.sql');
const CREATE_GAMES_TABLE_SQL = readFileSync(create_games_table_path, 'utf8');

const gamesToInsert = [
    { name: 'Pong', year: 1972 },
    { name: 'pedit5/The Dungeon', year: 1975 },
    { name: 'dnd/The Game of Dungeons', year: 1975 },
    { name: 'Space Invaders', year: 1978 },
];
const gameSqlParameters = [];
const placeholders = gamesToInsert.map((game, i) => {
    gameSqlParameters.push(game.name, game.year);
    return `($${i * 2 + 1}, $${i * 2 + 2})`;
});
const POPULATE_GAMES_TABLE_SQL = `INSERT INTO games (game_name, release_year) VALUES ${placeholders.join(', ')}`;

const host = argv[2] || process.env.PGHOST;
const database = argv[3] || process.env.PGDATABASE;
const role = argv[4] || process.env.PGUSER;
const pass = argv[5] || process.env.PGPASSWORD;

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
        await client.query(CREATE_GAMES_TABLE_SQL);
        await client.query(POPULATE_GAMES_TABLE_SQL, gameSqlParameters);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
    console.log("done");
}

await main();