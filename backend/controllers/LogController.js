import Log from "../models/LogModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getLogs = asyncHandler(async (req, res) => {
  const history = await Log.find({});
  res.json(history);
});

export { getLogs };
