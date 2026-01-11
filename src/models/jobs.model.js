import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    url: {
      type: String,
    },

    title: {
      type: String,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    link: {
      type: String,
    },
    pubDate: {
      type: String,
    },
    guid: {
      _isPermaLink: String,
      __text: String,
    },
    description: {
      type: String,
    },
    encoded: {
      __prefix: String,
      __cdata: String,
    },
    content: {
      _url: String,
      _medium: String,
      __prefix: String,
    },

    location: {
      __prefix: String,
      __cdata: String,
    },
    job_type: {
      __prefix: String,
      __cdata: String,
    },
    company: {
      __prefix: String,
      __cdata: String,
    },
  },
  {
    timestamps: true,
  }
);

export const JobSchema = mongoose.model("JobSchema", jobSchema);
