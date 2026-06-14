# Template Repository: Express, Express Validator, PostgreSql, EJS

Exactly as it says on the tin.

Be sure to do `cp .env.example .env` and fill in the values properly.

Use `npm run initDb` to initialize the database, but see the populatedb script first to know what parameters to include. By default it'll run locally properly if you make your .env file properly, but you need to understand the parameters if you want to initialize a remote database. By default, the order is host, db, role, pass, so something like `npm run initDb -- hostUrl dbName userRole userPassword` is what you'd want to type.

This template doesn't include any Express Validator samples because I'm too lazy to set that up for a template, but it's a good thing to know how to use and it's a good package to have installed.
