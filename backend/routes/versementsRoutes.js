import express from "express";
const router = express.Router();
import {
  createVersements,
  getVersementById,
  updateVersement,
  getVersements,
  getDetailsVersements,
} from "../controllers/versementController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(protect, getVersements, getDetailsVersements)
  .post(protect, createVersements);
router
  .route("/:id")
  .get(protect, getVersementById)
  .put(protect, updateVersement);

export default router;
