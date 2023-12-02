import Log from "../models/LogModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getLogs = asyncHandler(async (req, res, next) => {
  const history = await Log.find({});
  // res.json(history);
  req.history = history;
  next();
});

export { getLogs };
