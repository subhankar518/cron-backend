import express from "express";
import cors from "cors";
import "./src/config/worker.config.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import { logRouter } from "./src/routes/importLog.routes.js";

app.use("/api/v1/logs", logRouter);

export { app };
