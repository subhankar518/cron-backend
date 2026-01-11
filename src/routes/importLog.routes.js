import { getAllimportLogs } from "../controllers/importLog.controller.js";
import { Router } from "express";

const logRouter = Router();

logRouter.route("/getAllimportLogs").get(getAllimportLogs);

export { logRouter };
