import Log from "../models/LogModel.js";
import asyncHandler from "./asyncHandler.js";
import Depense from "../models/depenseModel.js";
import Locataire from "../models/locataireModel.js";
import User from "../models/userModel.js";

// Middleware to log actions
export const logMiddleware = async function (
  user,
  action,
  recordId,
  categorie,
  changes
) {
  try {
    await Log.create({ user, action, recordId, categorie, changes });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};

export const fetchingLogsDetails = asyncHandler(async (req, res, next) => {
  // console.log(req.history);
  const newLogs = [];

  for (const log of req.history) {
    try {
      const depenseDetails = await Depense.findById(log.recordId);
      const details = await Locataire.findById(log.recordId);
      const userDetails = await User.findById(log.user);
      newLogs.push({
        logId: log._id,
        userName: userDetails.name,
        action: log.action,
        nameId:
          log.categorie === "depense"
            ? depenseDetails.designation
            : log.categorie === "utilisateur"
            ? userDetails.name
            : details.name,
        categorie: log.categorie,
        changes: log.changes,
        date: log.timestamp,
      });
    } catch (error) {
      console.error(`Error processing log ${log._id}: ${error.message}`);
      newLogs.push({
        logId: log._id,
        error: true,
        errorMessage: error.message,
      });
    }
  }

  res.json(newLogs);
});
