import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDb } from "./src/db/connectDb.js";
import { importJobs } from "./src/controllers/job.controller.js";
import "./src/config/worker.config.js";
import cron from "node-cron";

dotenv.config();

const port = process.env.PORT || 8001;

connectDb()
  .then(() => {
    app.on("error", (error) => console.log("ERROR: ", error));
    app.listen(port, () => console.log(`Server is runing on ${port}`));
    importJobs().catch(console.error);
    cron.schedule("0 * * * *", importJobs);
  })
  .catch((err) => {
    console.log("Connection Error !!", err);
  });
