import axios from "axios";
import xml2js from "xml2js";
import { jobQueue } from "../config/worker.config.js";
import { ImportLogSchema } from "../models/importLog.model.js";
import { url } from "../../constant.js";

async function fetchJobs(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  const allDetails = await xml2js.parseStringPromise(response.data, {
    strict: false,
    trim: true,
    explicitArray: true,
  });

  return allDetails?.rss?.channel?.[0] || allDetails?.RSS?.CHANNEL?.[0];
}

const importJobs = async () => {
  console.log("Starting import for", url.length, "URLs");

  for (let i = 0; i < url.length; i++) {
    try {
      const response = await fetchJobs(url[i]);

      const jobArray = response?.ITEM || response?.item || [];

      const importLog = await ImportLogSchema.create({
        url: response?.LINK?.[0] || url[i],
        totalFetchCount: jobArray.length,
      });

      console.log(`URL [${i}] - Jobs found: ${jobArray.length}`);

      for (const job of jobArray) {
        await jobQueue.add("job-import", {
          ...job,
          mainUrl: url[i] || response?.LINK?.[0],
          importLogId: importLog?._id,
        });
      }
    } catch (error) {
      console.error(`Error processing URL ${url[i]}:`, error.message);
    }
  }
};

export { importJobs };
