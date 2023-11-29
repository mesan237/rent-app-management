import express from "express";
const router = express.Router();
import {
  createLocataires,
  getLocataires,
  updateLocataires,
  getLocataireById,
  deleteLocataires,
} from "../controllers/locataireController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(protect, getLocataires).post(protect, createLocataires);
router
  .route("/:id")
  .get(protect, getLocataireById)
  .put(protect, updateLocataires)
  .put(protect, deleteLocataires);

export default router;
