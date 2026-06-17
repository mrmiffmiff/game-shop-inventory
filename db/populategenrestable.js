#! /usr/bin/env node

import { Client } from "pg";
import { argv } from "node:process";
import { readFileSync } from "node:fs";
import path from "node:path";

const create_genres_table_path = path.join(import.meta.dirname, 'create_genres_table.sql');
const CREATE_GENRES_TABLE_SQL = readFileSync(create_genres_table_path, 'utf8');

const genresToInsert = [
    { genre: 'RPG' },
    { genre: 'Arcade' },
    { genre: 'Dungeon Crawler' },
];
const genreSqlParameters = [];
const placeholders = genresToInsert.map((genre, i) => {
    genreSqlParameters.push(genre.genre);
    return `($${i + 1})`;
});
const POPULATE_GENRES_TABLE_SQL = `INSERT INTO genres (genre) VALUES ${placeholders.join(', ')}`;

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
        await client.query(CREATE_GENRES_TABLE_SQL);
        await client.query(POPULATE_GENRES_TABLE_SQL, genreSqlParameters);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
    console.log("done");
}

await main();