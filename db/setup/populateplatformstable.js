#! /usr/bin/env node

import { Client } from "pg";
import { argv } from "node:process";
import { readFileSync } from "node:fs";
import path from "node:path";

const create_platforms_table_path = path.join(import.meta.dirname, 'create_platforms_table.sql');
const CREATE_PLATFORMS_TABLE_SQL = readFileSync(create_platforms_table_path, 'utf8');

const platformsToInsert = [
    { platform_name: 'PLATO', manufacturer: 4 },        // manufacturer: University of Illinois
    { platform_name: 'Arcade', manufacturer: null },     // manufacturer: N/A
    { platform_name: 'Atari 2600', manufacturer: 1 },   // manufacturer: Atari, Inc.
];
const platformSqlParameters = [];
const placeholders = platformsToInsert.map((platform, i) => {
    platformSqlParameters.push(platform.platform_name, platform.manufacturer);
    return `($${i * 2 + 1}, $${i * 2 + 2})`;
});
const POPULATE_PLATFORMS_TABLE_SQL = `INSERT INTO platforms (platform_name, manufacturer) VALUES ${placeholders.join(', ')}`;

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
        await client.query(CREATE_PLATFORMS_TABLE_SQL);
        await client.query(POPULATE_PLATFORMS_TABLE_SQL, platformSqlParameters);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
    console.log("done");
}

await main();
