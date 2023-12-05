import express from "express";
const router = express.Router();
import {
  createLocataires,
  getLocataires,
  updateLocataires,
  getLocataireById,
  deleteLocataires,
  updateFieldsForAllTenants,
} from "../controllers/locataireController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(protect, getLocataires)
  .post(protect, createLocataires)
  .put(protect, updateFieldsForAllTenants);
router
  .route("/:id")
  .get(protect, getLocataireById)
  .put(protect, updateLocataires)
  .delete(protect, deleteLocataires);

export default router;
