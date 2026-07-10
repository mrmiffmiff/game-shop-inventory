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
    const creatorTypes = await db.getCreatorTypes();
    res.render("creatorForm", { title: "Create New Creator", header: "Create New Creator", creator: null, creatorName: null, country: null, website: null, foundingYear: null, type: null, creatorTypes: creatorTypes });
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
    body("website").trim(),
    body("foundingYear").trim().optional({ checkFalsy: true })
        .isInt().withMessage("Founding year must be a number.")
        .toInt(),
    body("type").trim().custom(async value => {
        const creatorTypes = await db.getCreatorTypes();
        if (!creatorTypes.includes(value)) {
            throw new Error("Type must be one of: " + creatorTypes.join(", ") + ".");
        }
        return true;
    }),
];

const postCreateCreator = [
    validateCreator,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const { creatorName: inputName, country: inputCountry, website: inputWebsite, foundingYear: inputFoundingYear, type: inputType } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const creatorTypes = await db.getCreatorTypes();
            return res.status(400).render("creatorForm", { title: "Create New Creator", header: "Create New Creator", creator: null, creatorName: inputName, country: inputCountry, website: inputWebsite, foundingYear: inputFoundingYear, type: inputType, creatorTypes: creatorTypes, errors: errors.array(), });
        }
        const { creatorName, country, website, foundingYear, type } = matchedData(req);
        await db.addNewCreator(creatorName, foundingYear ?? null, country || null, website || null, type);
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
    const creatorTypes = await db.getCreatorTypes();
    res.render("creatorForm", { title: "Edit Creator", header: "Edit Creator", creator: creator, creatorName: creator.creator_name, country: creator.country, website: creator.website, foundingYear: creator.founding_year, type: creator.type, creatorTypes: creatorTypes });
}

const putEditCreator = [
    validateCreator,
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
        const { creatorName: inputName, country: inputCountry, website: inputWebsite, foundingYear: inputFoundingYear, type: inputType } = req.body;
        const id = Number.parseInt(req.params.id);
        const oldCreator = await db.getCreatorById(id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const creatorTypes = await db.getCreatorTypes();
            return res.status(400).render("creatorForm", { title: "Edit Creator", header: "Edit Creator", creator: oldCreator, creatorName: inputName, country: inputCountry, website: inputWebsite, foundingYear: inputFoundingYear, type: inputType, creatorTypes: creatorTypes, errors: errors.array(), });
        }
        const { creatorName, country, website, foundingYear, type } = matchedData(req);
        await db.updateCreatorById(id, creatorName, foundingYear ?? null, country || null, website || null, type);
        res.redirect("/creators/" + id);
    }
]

export default {
    getAllCreators,
    getCreateCreator,
    postCreateCreator,
    getEditCreator,
    putEditCreator,
    getCreator
}
