import mongoose from "mongoose";
import { logMiddleware } from "../middleware/logMiddleware.js";

const versementSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  montants: [
    {
      type: { type: String, required: true }, // Type of amount, e.g., 'payment', 'fee', etc.
      value: { type: Number, required: true },
      locataire: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locataire",
      },
    },
  ],
  date: { type: Date, required: true, default: Date.now },
  comments: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
});

// Middleware to log actions
versementSchema.pre("save", async function (next) {
  if (this.isNew) {
    // If a new record is being created
    this.user = this.user; // Replace with the actual user ID or username
  } else {
    // If an existing record is being updated
    this.updatedBy = this.updatedBy; // Replace with the actual user ID or username
    this.updatedAt = new Date();
  }

  // Log the create or update action with changes
  const changes = this.modifiedPaths().reduce((acc, path) => {
    acc[path] = this[path];
    return acc;
  }, {});
  // console.log(changes);
  await logMiddleware(this.user, "update", this._id, changes);
  next();
});

versementSchema.pre("remove", async function (next) {
  // If a document is being deleted
  this.deletedBy = this.deletedBy; // Replace with the actual user ID or username
  this.deletedAt = new Date();

  // Log the delete action
  await logMiddleware(this.deletedBy, "delete", this._id);
  next();
});
const Versement = mongoose.model("Versement", versementSchema);
export default Versement;
