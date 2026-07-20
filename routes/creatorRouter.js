import { Router } from "express";
import Controller from "../controllers/creatorController.js";

const creatorRouter = Router();

creatorRouter.get("/", Controller.getAllCreators);
creatorRouter.get("/create", Controller.getCreateCreator);
creatorRouter.post("/create", Controller.postCreateCreator);
creatorRouter.get("/:id", Controller.getCreator);
creatorRouter.get("/:id/edit", Controller.getEditCreator);
creatorRouter.put("/:id/edit", Controller.putEditCreator);
creatorRouter.get("/:id/delete", Controller.getDeleteCreator);
creatorRouter.delete("/:id/delete", Controller.deleteCreator);

export default creatorRouter;
