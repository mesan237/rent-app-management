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

/*
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
*/

export const fetchingLogsDetails = asyncHandler(async (req, res, next) => {
  const newLogs = [];
  const logIds = req.history.map((log) => log._id);
  const userIds = req.history.map((log) => log.user);
  const depenseIds = req.history
    .filter((log) => log.categorie === "depense")
    .map((log) => log.recordId);
  const locataireIds = req.history
    .filter((log) => log.categorie === "locataire" && !log.isLocataireDeleted)
    .map((log) => log.recordId);

  const [users, depenses, locataires] = await Promise.all([
    User.find({ _id: { $in: userIds } }, { name: 1 }),
    Depense.find({ _id: { $in: depenseIds } }, { designation: 1 }),
    Locataire.find({ _id: { $in: locataireIds } }, { name: 1 }),
  ]);

  for (const log of req.history) {
    try {
      let nameId;

      if (log.categorie === "depense") {
        const depenseDetails = depenses.find((depense) =>
          depense._id.equals(log.recordId)
        );
        nameId = depenseDetails.designation;
      } else if (log.categorie === "utilisateur") {
        const user = users.find((user) => user._id.equals(log.user));
        nameId = user.name;
      } else if (log.categorie === "locataire" && !log.isLocataireDeleted) {
        const locataireDetails = locataires.find((locataire) =>
          locataire._id.equals(log.recordId)
        );
        nameId = locataireDetails.name;
      } else {
        nameId = log.locataireDetails.name;
      }

      const user = users.find((user) => user._id.equals(log.user));

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
