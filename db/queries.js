import pool from "./pool.js";

// This does basically nothing and is just a sample.
async function getExample() {
    const { rows } = await pool.query("SELECT * FROM users;");
    return rows;
}

export default {
    getExample,
};