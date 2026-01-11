import mongoose, { Schema } from "mongoose";

const importLogSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    totalFetchCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalImportedJobs: {
      type: Number,
      default: 0,
      min: 0,
    },
    newJobs: {
      type: Number,
      default: 0,
      min: 0,
    },
    updatedJobs: {
      type: Number,
      default: 0,
      min: 0,
    },
    failedJobs: [
      {
        count: { type: Number, default: 0 },
        reason: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ImportLogSchema = mongoose.model(
  "ImportLogSchema",
  importLogSchema
);
