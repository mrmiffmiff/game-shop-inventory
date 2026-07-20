import db from "../db/platform_queries/platform_queries.js";
import { body, validationResult, matchedData } from "express-validator";

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
async function getCreatePlatform(req, res) {
    res.render("platformForm", { title: "Create New Platform", header: "Create New Platform", platform: null, platformName: null });
}

const validatePlatform = [
    body("platformName").trim().customSanitizer(value => {
        if (!value) return value;
        return value
            .replace(/[‘’‚‛]/g, "'")
            .replace(/[“”„‟]/g, '"');
    })
        .notEmpty().withMessage("Platform name cannot be blank."),
];

const postCreatePlatform = [
    validatePlatform,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const inputName = req.body.platformName;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("platformForm", { title: "Create New Platform", header: "Create New Platform", platform: null, platformName: inputName, errors: errors.array(), });
        }
        const { platformName } = matchedData(req);
        await db.addNewPlatform(platformName);
        res.redirect("/platforms");
    }
];

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

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getEditPlatform(req, res) {
    const id = Number.parseInt(req.params.id);
    const platform = await db.getPlatformById(id);
    res.render("platformForm", { title: "Edit Platform", header: "Edit Platform", platform: platform, platformName: platform.platform_name });
}

const putEditPlatform = [
    validatePlatform,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const inputName = req.body.platformName;
        const id = Number.parseInt(req.params.id);
        const oldPlatform = await db.getPlatformById(id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("platformForm", { title: "Edit Platform", header: "Edit Platform", platform: oldPlatform, platformName: inputName, errors: errors.array(), });
        }
        const { platformName } = matchedData(req);
        await db.updatePlatformById(id, platformName);
        res.redirect("/platforms/" + id);
    }
]

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getDeletePlatform(req, res) {
    const id = Number.parseInt(req.params.id);
    const platform = await db.getPlatformById(id);
    res.render("deleteConfirm", { title: `Delete Platform ${platform.platform_name}`, resource: { id: id, name: platform.platform_name, type: "platform" }, })
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deletePlatform(req, res) {
    const id = Number.parseInt(req.params.id);
    await db.deletePlatformById(id);
    res.redirect("/platforms");
}

export default {
    getAllPlatforms,
    getCreatePlatform,
    postCreatePlatform,
    getEditPlatform,
    putEditPlatform,
    getPlatform,
    getDeletePlatform,
    deletePlatform,
}
