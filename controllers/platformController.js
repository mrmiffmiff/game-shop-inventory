import db from "../db/platform_queries/platform_queries.js";

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getAllPlatforms(req, res) {
    const platforms = await db.getAllPlatforms();
    res.render("platforms", { platforms: platforms, title: "All Platforms" });
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getPlatform(req, res) {
    const id = Number.parseInt(req.params.id);
    const platform = await db.getPlatformById(id);
    const games = await db.getGamesOnPlatform(id);
    res.render("platform", { title: platform.platform_name, platform: platform, games: games });
}

export default {
    getAllPlatforms,
    getPlatform
}
