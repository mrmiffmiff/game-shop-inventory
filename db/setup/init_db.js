import { execSync } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2).join(' ');

const scripts = [
    'populategamestable.js',
    'populategenrestable.js',
    'populatecreatorstable.js',
    'populateplatformstable.js',
];

const scriptDir = import.meta.dirname;

for (const script of scripts) {
    execSync(`node ${path.join(scriptDir, script)} ${args}`, { stdio: 'inherit' });
}