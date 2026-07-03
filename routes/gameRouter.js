import { Router } from "express";
import Controller from "../controllers/gamesController.js";

const gameRouter = Router();

gameRouter.get("/", Controller.getAllGames);
gameRouter.get("/:id", Controller.getGame);

export default gameRouter;