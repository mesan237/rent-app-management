import express from "express";
const router = express.Router();
import { getLogs } from "../controllers/LogController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { fetchingLogsDetails } from "../middleware/logMiddleware.js";

router.route("/").get(protect, getLogs, fetchingLogsDetails);

export default router;
