import Log from "../models/LogModel.js";

// Middleware to log actions
export const logMiddleware = async function (user, action, recordId, changes) {
  try {
    await Log.create({ user, action, recordId, changes });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};
