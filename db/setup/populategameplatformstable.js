#! /usr/bin/env node

import { Client } from "pg";
import { argv } from "node:process";
import { readFileSync } from "node:fs";
import path from "node:path";

const create_game_platforms_table_path = path.join(import.meta.dirname, 'create_game_platforms_table.sql');
const CREATE_GAME_PLATFORMS_TABLE_SQL = readFileSync(create_game_platforms_table_path, 'utf8');

const gamePlatformsToInsert = [
    { game_id: 1, platform_id: 2 }, // Pong -> Arcade
    { game_id: 2, platform_id: 1 }, // pedit5/The Dungeon -> PLATO
    { game_id: 3, platform_id: 1 }, // dnd/The Game of Dungeons -> PLATO
    { game_id: 4, platform_id: 2 }, // Space Invaders -> Arcade
    { game_id: 4, platform_id: 3 }, // Space Invaders -> Atari 2600
];
const gamePlatformSqlParameters = [];
const placeholders = gamePlatformsToInsert.map((row, i) => {
    gamePlatformSqlParameters.push(row.game_id, row.platform_id);
    return `($${i * 2 + 1}, $${i * 2 + 2})`;
});
const POPULATE_GAME_PLATFORMS_TABLE_SQL = `INSERT INTO game_platforms (game_id, platform_id) VALUES ${placeholders.join(', ')}`;

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
        await client.query(CREATE_GAME_PLATFORMS_TABLE_SQL);
        await client.query(POPULATE_GAME_PLATFORMS_TABLE_SQL, gamePlatformSqlParameters);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
    console.log("done");
}

await main();
