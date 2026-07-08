import { Router } from "express";
import Controller from "../controllers/platformController.js";

const platformRouter = Router();

platformRouter.get("/", Controller.getAllPlatforms);
platformRouter.get("/:id", Controller.getPlatform);

export default platformRouter;
