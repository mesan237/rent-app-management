import express from "express";
const router = express.Router();
import {
  getDepenses,
  createDepenses,
  modifierDepenses,
  getDepenseById,
  deleteDepenses,
} from "../controllers/depenseController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.route("/").get(protect, getDepenses).post(protect, createDepenses);

router
  .route("/:id")
  .get(protect, getDepenseById)
  .put(protect, modifierDepenses)
  .delete(protect, deleteDepenses);

export default router;
