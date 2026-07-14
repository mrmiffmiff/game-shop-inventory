import { Router } from "express";
import Controller from "../controllers/gamesController.js";

const gameRouter = Router();

gameRouter.get("/", Controller.getAllGames);
gameRouter.get("/create", Controller.getCreateGame);
gameRouter.post("/create", Controller.postCreateGame);
gameRouter.get("/:id", Controller.getGame);
gameRouter.get("/:id/edit", Controller.getEditGame);
gameRouter.put("/:id/edit", Controller.putEditGame);
gameRouter.get("/:id/genres/edit", Controller.getEditGameGenres);
gameRouter.put("/:id/genres/edit", Controller.putEditGameGenres);
gameRouter.get("/:id/platforms/edit", Controller.getEditGamePlatforms);
gameRouter.put("/:id/platforms/edit", Controller.putEditGamePlatforms);
gameRouter.get("/:id/creators/edit", Controller.getEditGameCreators);
gameRouter.put("/:id/creators/edit", Controller.putEditGameCreators);

export default gameRouter;