#! /usr/bin/env node

import { Client } from "pg";
import { argv } from "node:process";
import { readFileSync } from "node:fs";
import path from "node:path";

const create_game_creators_table_path = path.join(import.meta.dirname, 'create_game_creators_table.sql');
const CREATE_GAME_CREATORS_TABLE_SQL = readFileSync(create_game_creators_table_path, 'utf8');

const gameCreatorsToInsert = [
    { game_id: 1, creator_id: 1 }, // Pong - Atari, Inc.
    { game_id: 2, creator_id: 4 }, // pedit5/The Dungeon - University of Illinois
    { game_id: 3, creator_id: 4 }, // dnd/The Game of Dungeons - University of Illinois
    { game_id: 4, creator_id: 2 }, // Space Invaders - Taito Corporation
];
const gameCreatorSqlParameters = [];
const placeholders = gameCreatorsToInsert.map((row, i) => {
    gameCreatorSqlParameters.push(row.game_id, row.creator_id);
    return `($${i * 2 + 1}, $${i * 2 + 2})`;
});
const POPULATE_GAME_CREATORS_TABLE_SQL = `INSERT INTO game_creators (game_id, creator_id) VALUES ${placeholders.join(', ')}`;

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
        await client.query(CREATE_GAME_CREATORS_TABLE_SQL);
        await client.query(POPULATE_GAME_CREATORS_TABLE_SQL, gameCreatorSqlParameters);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
    console.log("done");
}

await main();
