import mongoose from "mongoose";
import { logMiddleware } from "../middleware/logMiddleware.js";

function getMonthDifference(startDate, endDate) {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  return (endYear - startYear) * 12 + (endMonth - startMonth);
}

// Création de la liste de chambres
const chambres = [];
for (let i = 1; i <= 32; i++) {
  const chambre = `${i}A`;
  chambres.push(chambre);
}
for (let i = 1; i <= 14; i++) {
  const chambre = `${i}B`;
  chambres.push(chambre);
}
for (let i = 1; i <= 3; i++) {
  const chambre = `studio ${i}B`;
  chambres.push(chambre);
}

const locataireSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  num: { type: String, enum: chambres, required: true },
  name: { type: String, required: true },
  tel: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  months: { type: Number, required: true },
  montant: { type: Number, required: true },
  debts: { type: Number, required: true },
  comments: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
});

locataireSchema.pre("validate", async function (next) {
  if (!this.date) {
    next();
  }
  this.months = getMonthDifference(this.date, new Date());
  const annee = Math.floor(this.months % 12);
  const rentAmount =
    this?.num[1] === "A" ? 15000 : this?.num[1] === "B" ? 12000 : 25000;

  if (this.montant !== undefined && this.months !== undefined) {
    this.debts = this.montant - (this.months - 2 * annee) * rentAmount;
    this.debts = this.debts > 0 ? 0 : this.debts;
  }
});

// Middleware to log actions
locataireSchema.pre("save", async function (next) {
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
  await logMiddleware(
    this.user,
    this.isNew ? "create" : "update",
    this._id,
    changes
  );
  next();
});

locataireSchema.pre("remove", async function (next) {
  // If a document is being deleted
  this.deletedBy = this.deletedBy; // Replace with the actual user ID or username
  this.deletedAt = new Date();

  // Log the delete action
  await logMiddleware(this.deletedBy, "delete", this._id);
  next();
});

const Locataire = mongoose.model("Locataire", locataireSchema);
export default Locataire;
