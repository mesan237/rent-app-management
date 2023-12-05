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
  isLocataireDeleted,
  locataireDetails,
  changes
) {
  try {
    await Log.create({
      user,
      action,
      recordId,
      categorie,
      isLocataireDeleted,
      locataireDetails,
      changes,
    });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};

export const fetchingLogsDetails = asyncHandler(async (req, res, next) => {
  const newLogs = [];

  for (const log of req.history) {
    try {
      let nameId;
      if (log.categorie === "depense") {
        const depenseDetails = await Depense.findById(log.recordId).select(
          "designation"
        );
        nameId = depenseDetails.designation;
      } else if (log.categorie === "utilisateur") {
        const user = await User.findById(log.user).select("name");
        nameId = user.name;
      } else if (log.categorie === "locataire" && !log.isLocataireDeleted) {
        const locataireDetails = await Locataire.findById(log.recordId).select(
          "name"
        );
        nameId = locataireDetails.name;
      } else {
        nameId = log.locataireDetails.name;
      }

      const user = await User.findById(log.user).select("name");

      newLogs.push({
        logId: log._id,
        userName: user.name,
        action: log.action,
        nameId,
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
