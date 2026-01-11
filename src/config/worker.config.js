import { Queue, Worker } from "bullmq";
import { redisConnectionInstance } from "./redis.config.js";
import { JobSchema } from "../models/jobs.model.js";
import { ImportLogSchema } from "../models/importLog.model.js";

const jobQueue = new Queue("job-import", {
  connection: redisConnectionInstance,
});

new Worker(
  "job-import",
  async (job) => {
    const data = job.data;

    if (!data || !data.id || !data.id[0]) {
      const errorMsg = `job ${job.id} skipped: already present in db`;
      console.error(errorMsg);

      if (data?.importLogId) {
        await ImportLogSchema.updateOne(
          { _id: data.importLogId },
          { $push: { failedJobs: { reason: errorMsg } } }
        ).catch((err) => console.error("Failed to update importLog", err));
      }
      return;
    }

    const jobId = data.id[0];

    try {
      const result = await JobSchema.updateOne(
        { id: jobId },
        {
          $set: {
            id: jobId,
            title: data.title?.[0],
            link: data.link?.[0] || "",
            pubDate: data.pubDate?.[0],
            description: data.description?.[0] || "",
            url: data.mainUrl || "",
            guid: {
              __text: data.guid?.[0]?._ || data.guid?.[0] || "",
            },
            company: {
              __cdata:
                data["job_listing:company"]?.[0] ||
                data.company?.[0] ||
                "unknown company",
            },
          },
        },
        { upsert: true, runValidators: true }
      );

      if (data?.importLogId) {
        if (result.upsertedCount === 1) {
          await ImportLogSchema.updateOne(
            { _id: data.importLogId },
            { $inc: { newJobs: 1, totalImportedJobs: 1 } }
          );
          console.log(`New job created: ${jobId}`);
        } else if (result.matchedCount === 1) {
          await ImportLogSchema.updateOne(
            { _id: data.importLogId },
            { $inc: { updatedJobs: 1, totalImportedJobs: 1 } }
          );
          console.log(`Job updated: ${jobId}`);
        }
      }
    } catch (error) {
      console.error(`Error processing job ${jobId}:`, error.message);

      if (data?.importLogId) {
        try {
          await ImportLogSchema.updateOne(
            { _id: data.importLogId },
            {
              $push: {
                failedJobs: {
                  reason: `Job ${jobId} failed: ${error.message}`,
                  timestamp: new Date(),
                },
              },
            }
          );
        } catch (logError) {
          console.error(
            "Could not log error to importLogSchema",
            logError.message
          );
        }
      }
      throw error;
    }
  },
  {
    connection: redisConnectionInstance,
    concurrency: 5,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  }
);

export { jobQueue };
