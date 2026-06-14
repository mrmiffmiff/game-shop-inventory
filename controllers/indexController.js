import db from "../db/queries.js";

export async function getIndex(req, res) {
    const users = await db.getExample();
    res.render("index", { users: users });
}