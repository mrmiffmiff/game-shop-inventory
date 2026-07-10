import db from "../db/platform_queries/platform_queries.js";
import creatorDb from "../db/creator_queries/creator_queries.js";
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
    const creators = await creatorDb.getAllCreators();
    res.render("platformForm", { title: "Create New Platform", header: "Create New Platform", platform: null, platformName: null, manufacturer: null, creators: creators });
}

const validatePlatform = [
    body("platformName").trim().customSanitizer(value => {
        if (!value) return value;
        return value
            .replace(/[‘’‚‛]/g, "'")
            .replace(/[“”„‟]/g, '"');
    })
        .notEmpty().withMessage("Platform name cannot be blank."),
    body("manufacturer").trim().optional({ checkFalsy: true })
        .isInt().withMessage("Invalid manufacturer selected.")
        .toInt()
        .custom(async value => {
            const creators = await creatorDb.getAllCreators();
            if (!creators.some(creator => creator.id === value)) {
                throw new Error("Selected manufacturer does not exist.");
            }
            return true;
        }),
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
        const inputManufacturer = req.body.manufacturer;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const creators = await creatorDb.getAllCreators();
            return res.status(400).render("platformForm", { title: "Create New Platform", header: "Create New Platform", platform: null, platformName: inputName, manufacturer: inputManufacturer, creators: creators, errors: errors.array(), });
        }
        const { platformName, manufacturer } = matchedData(req);
        await db.addNewPlatform(platformName, manufacturer ?? null);
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
    const creators = await creatorDb.getAllCreators();
    res.render("platformForm", { title: "Edit Platform", header: "Edit Platform", platform: platform, platformName: platform.platform_name, manufacturer: platform.manufacturer, creators: creators });
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
        const inputManufacturer = req.body.manufacturer;
        const id = Number.parseInt(req.params.id);
        const oldPlatform = await db.getPlatformById(id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const creators = await creatorDb.getAllCreators();
            return res.status(400).render("platformForm", { title: "Edit Platform", header: "Edit Platform", platform: oldPlatform, platformName: inputName, manufacturer: inputManufacturer, creators: creators, errors: errors.array(), });
        }
        const { platformName, manufacturer } = matchedData(req);
        await db.updatePlatformById(id, platformName, manufacturer ?? null);
        res.redirect("/platforms/" + id);
    }
]

export default {
    getAllPlatforms,
    getCreatePlatform,
    postCreatePlatform,
    getEditPlatform,
    putEditPlatform,
    getPlatform
}
