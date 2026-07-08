import db from "../db/creator_queries/creator_queries.js";

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getAllCreators(req, res) {
    const creators = await db.getAllCreators();
    res.render("creators", { creators: creators, title: "All Creators" });
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getCreator(req, res) {
    const id = Number.parseInt(req.params.id);
    const creator = await db.getCreatorById(id);
    const games = await db.getGamesByCreator(id);
    res.render("creator", { title: creator.creator_name, creator: creator, games: games });
}

export default {
    getAllCreators,
    getCreator
}
