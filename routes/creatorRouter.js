import { Router } from "express";
import Controller from "../controllers/creatorController.js";

const creatorRouter = Router();

creatorRouter.get("/", Controller.getAllCreators);
creatorRouter.get("/:id", Controller.getCreator);

export default creatorRouter;
