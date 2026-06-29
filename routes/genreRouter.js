import { Router } from "express";
import Controller from "../controllers/genreController.js"

const genreRouter = Router();

genreRouter.get("/", Controller.getAllGenres);
genreRouter.get("/:id", Controller.getGenre);

export default genreRouter;