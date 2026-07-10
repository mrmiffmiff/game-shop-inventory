import { Router } from "express";
import Controller from "../controllers/gamesController.js";

const gameRouter = Router();

gameRouter.get("/", Controller.getAllGames);
gameRouter.get("/create", Controller.getCreateGame);
gameRouter.post("/create", Controller.postCreateGame);
gameRouter.get("/:id", Controller.getGame);
gameRouter.get("/:id/edit", Controller.getEditGame);
gameRouter.put("/:id/edit", Controller.putEditGame);

export default gameRouter;