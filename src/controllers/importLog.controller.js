import { ImportLogSchema } from "../models/importLog.model.js";

const getAllimportLogs = async () => {
  try {
    const allLogs = await ImportLogSchema.find({});
    return allLogs;
  } catch (error) {
    console.log("Error while geting all logs", error);
  }
};

export { getAllimportLogs };
