#! /usr/bin/env node

import { Client } from "pg";
import { argv } from "node:process";
import { readFileSync } from "node:fs";
import path from "node:path";

const create_creators_table_path = path.join(import.meta.dirname, 'create_creators_table.sql');
const CREATE_CREATORS_TABLE_SQL = readFileSync(create_creators_table_path, 'utf8');

const creatorsToInsert = [
    { creator_name: 'Atari, Inc.', founding_year: 1972, country: 'USA', website: null, type: 'company' },
    { creator_name: 'Taito Corporation', founding_year: 1953, country: 'Japan', website: 'http://www.taito.com/', type: 'company' },
    { creator_name: 'Richard Garriott', founding_year: 1979, country: 'USA', website: null, type: 'individual' },
    { creator_name: 'University of Illinois', founding_year: 1867, country: 'USA', website: 'https://illinois.edu/', type: 'other' },
];
const creatorSqlParameters = [];
const placeholders = creatorsToInsert.map((creator, i) => {
    creatorSqlParameters.push(creator.creator_name, creator.founding_year, creator.country, creator.website, creator.type);
    return `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`;
});
const POPULATE_CREATORS_TABLE_SQL = `INSERT INTO creators (creator_name, founding_year, country, website, type) VALUES ${placeholders.join(', ')}`;

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
        await client.query(CREATE_CREATORS_TABLE_SQL);
        await client.query(POPULATE_CREATORS_TABLE_SQL, creatorSqlParameters);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
    console.log("done");
}

await main();
