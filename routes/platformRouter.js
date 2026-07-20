import { Router } from "express";
import Controller from "../controllers/platformController.js";

const platformRouter = Router();

platformRouter.get("/", Controller.getAllPlatforms);
platformRouter.get("/create", Controller.getCreatePlatform);
platformRouter.post("/create", Controller.postCreatePlatform);
platformRouter.get("/:id", Controller.getPlatform);
platformRouter.get("/:id/edit", Controller.getEditPlatform);
platformRouter.put("/:id/edit", Controller.putEditPlatform);
platformRouter.get("/:id/delete", Controller.getDeletePlatform);
platformRouter.delete("/:id/delete", Controller.deletePlatform);

export default platformRouter;
