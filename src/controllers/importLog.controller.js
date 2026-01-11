import { ImportLogSchema } from "../models/importLog.model.js";

const getImportLogs = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const result = await getImportLogsUsingPages({
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch import logs",
      error: error.message,
    });
  }
};

const getImportLogsUsingPages = async ({ page = 1, limit = 10 }) => {
  try {
    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      throw new Error("Invalid parameter");
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ImportLogSchema.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      ImportLogSchema.countDocuments(),
    ]);

    return {
      data: logs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error while getting paginated import logs:", error);
    throw error;
  }
};

export { getImportLogs };
