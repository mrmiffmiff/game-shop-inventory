import { Router } from "express";
import Controller from "../controllers/genreController.js"

const genreRouter = Router();

genreRouter.get("/", Controller.getAllGenres);
genreRouter.get("/create", Controller.getCreateGenre);
genreRouter.post("/create", Controller.postCreateGenre);
genreRouter.get("/:id", Controller.getGenre);
genreRouter.get("/:id/edit", Controller.getEditGenre);
genreRouter.put("/:id/edit", Controller.putEditGenre);

export default genreRouter;