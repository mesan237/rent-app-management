import express from "express";
const router = express.Router();
import { getLogs } from "../controllers/LogController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(protect, getLogs);

export default router;
