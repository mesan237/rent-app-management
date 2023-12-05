import mongoose from "mongoose";
import { logMiddleware } from "../middleware/logMiddleware.js";
import Versement from "../models/versementModel.js";

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
/*
const mongoose = require('mongoose');

const versementSchema = mongoose.Schema({
  type: { type: String, required: true },
  value: { type: Number, required: true },
  dateVersement: { type: Date, required: true },
  comments: String,
  userIdM: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  // Add other versement fields as needed
});*/

const locataireSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  num: { type: String, enum: chambres, required: true },
  name: { type: String, required: true },
  tel: { type: Number, required: true },
  date: { type: Date, required: true },
  months: { type: Number, required: true },
  montant: { type: Number, required: true },
  debts: { type: Number, required: true },
  comments: String,
  // versements: [versementSchema],
  createdAt: { type: Date },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
});

locataireSchema.pre("validate", async function (next) {
  if (!this.deletedAt) {
    next();
  }
  this.months = getMonthDifference(this.date, new Date());
  const annee = Math.floor(this.months / 12);
  const rentAmount =
    this?.num[1] === "A" || this?.num[2] === "A"
      ? 15000
      : this?.num[1] === "B" || this?.num[2] === "B"
      ? 12000
      : 25000;
  if (this.montant !== undefined && this.months !== undefined) {
    this.debts = this.montant - (this.months - 2 * annee) * rentAmount;
    this.debts = this.debts > 0 ? 0 : this.debts;
  }
  console.log(rentAmount, this.months, annee);
});

// Middleware to log actions
locataireSchema.pre("save", async function (next) {
  let changes;
  let action;
  console.log("wait...");
  if (this.deletedAt || this.isNew) {
    this.user = this.user; // Replace with the actual user ID or username
    action = "create";
    console.log("create...");
  } else {
    // If an existing record is being updated
    this.updatedBy = this.updatedBy; // Replace with the actual user ID or username
    this.updatedAt = new Date();
    action = "update";
    console.log("update...");
    changes = this.modifiedPaths().reduce((acc, path) => {
      acc[path] = this[path];
      return acc;
    }, {});
  }

  // console.log(changes);
  await logMiddleware(
    this.user,
    action,
    this._id,
    "locataire",
    false,
    null,
    changes
  );
  next();
});

// Define a pre hook for 'delete' a locataire(tenant)
locataireSchema.pre("findOneAndUpdate", async function (next) {
  // Check if soft deletion is enabled (optional
  let locataireDetails = {};
  if (!this.get("deletedAt")) {
    // console.log("create...", this._update, this);

    await logMiddleware(
      this.get("user"),
      "create",
      this._conditions._id,
      "locataire",
      false,
      null,
      null
    );

    // add a new versement
    const newVersementData = {
      user: this.get("user"),
      montants: [
        {
          type: "payment",
          value: this.get("montant"),
          locataire: this._conditions._id,
          dateVersement: this.get("date"),
        },
      ],
    };

    // Create a new versement document
    async function createVersement(newVersementData) {
      try {
        const createdVersement = await Versement.create(newVersementData);
        console.log("Versement created successfully:", createdVersement);
      } catch (err) {
        console.error("Error creating versement:", err);
      }
    }

    createVersement(newVersementData);
  } else {
    console.log(
      "delete...",
      this._update.user,
      this._conditions._id,
      this._update,
      this
    );
    const locataire = await Locataire.findById(this._conditions._id);

    if (locataire) {
      console.log("locataire", locataire);

      const result = await Versement.aggregate([
        {
          $match: {
            "montants.locataire": new mongoose.Types.ObjectId(
              this._conditions._id
            ),
          },
        },
        {
          $unwind: "$montants",
        },
        {
          $match: {
            "montants.locataire": new mongoose.Types.ObjectId(
              this._conditions._id
            ),
          },
        },
        {
          $group: {
            _id: null,
            totalValue: { $sum: "$montants.value" },
          },
        },
      ]);

      // The result will be an array with the totalValue for the specified Locataire
      const totalValue = result.length > 0 ? result[0].totalValue : 0;
      locataireDetails.num = locataire.num;
      locataireDetails.name = locataire.name;
      locataireDetails.dateEntry = locataire.date;
      locataireDetails.tel = locataire.tel;
      locataireDetails.montantTotal = locataire.montant + totalValue;
      // console.log("Total Value:", totalValue, locataireDetails);
    }
    //delete all versements from that tenant
    try {
      await Versement.deleteMany({
        "montants.locataire": this._conditions._id,
      });
      console.log("Documents with locataire ID deleted successfully.");
    } catch (err) {
      console.error("Error deleting documents:", err);
    }

    await logMiddleware(
      this._update.user,
      "delete",
      this._conditions._id,
      "locataire",
      true,
      locataireDetails,
      undefined
    );
  }

  next();
});

const Locataire = mongoose.model("Locataire", locataireSchema);
export default Locataire;
