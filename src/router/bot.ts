import { Router } from "express";
import { BotController } from "../controller/bot";
const botRouter = Router();
const controller = new BotController();

botRouter.post("/message", controller.message);

export default botRouter;
