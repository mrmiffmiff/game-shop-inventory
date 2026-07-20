import db from "../db/creator_queries/creator_queries.js";
import { body, validationResult, matchedData } from "express-validator";

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
async function getCreateCreator(req, res) {
    res.render("creatorForm", { title: "Create New Creator", header: "Create New Creator", creator: null, creatorName: null, country: null });
}

const validateCreator = [
    body("creatorName").trim().customSanitizer(value => {
        if (!value) return value;
        return value
            .replace(/[‘’‚‛]/g, "'")
            .replace(/[“”„‟]/g, '"');
    })
        .notEmpty().withMessage("Creator name cannot be blank."),
    body("country").trim(),
];

const postCreateCreator = [
    validateCreator,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const { creatorName: inputName, country: inputCountry } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("creatorForm", { title: "Create New Creator", header: "Create New Creator", creator: null, creatorName: inputName, country: inputCountry, errors: errors.array(), });
        }
        const { creatorName, country } = matchedData(req);
        await db.addNewCreator(creatorName, country || null);
        res.redirect("/creators");
    }
];

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

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getEditCreator(req, res) {
    const id = Number.parseInt(req.params.id);
    const creator = await db.getCreatorById(id);
    res.render("creatorForm", { title: "Edit Creator", header: "Edit Creator", creator: creator, creatorName: creator.creator_name, country: creator.country });
}

const putEditCreator = [
    validateCreator,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const { creatorName: inputName, country: inputCountry } = req.body;
        const id = Number.parseInt(req.params.id);
        const oldCreator = await db.getCreatorById(id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("creatorForm", { title: "Edit Creator", header: "Edit Creator", creator: oldCreator, creatorName: inputName, country: inputCountry, errors: errors.array(), });
        }
        const { creatorName, country } = matchedData(req);
        await db.updateCreatorById(id, creatorName, country || null);
        res.redirect("/creators/" + id);
    }
]

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getDeleteCreator(req, res) {
    const id = Number.parseInt(req.params.id);
    const creator = await db.getCreatorById(id);
    res.render("deleteConfirm", { title: `Delete Creator ${creator.creator_name}`, resource: { id: id, name: creator.creator_name, type: "creator" }, })
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deleteCreator(req, res) {
    const id = Number.parseInt(req.params.id);
    await db.deleteCreatorById(id);
    res.redirect("/creators");
}

export default {
    getAllCreators,
    getCreateCreator,
    postCreateCreator,
    getEditCreator,
    putEditCreator,
    getCreator,
    getDeleteCreator,
    deleteCreator,
}
