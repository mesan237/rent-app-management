import mongoose from "mongoose";
import { logMiddleware } from "../middleware/logMiddleware.js";
import { userId } from "../controllers/versementController.js";
import Locataire from "./locataireModel.js";

function getMonthDifference(startDate, endDate) {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  return (endYear - startYear) * 12 + (endMonth - startMonth);
}

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
      dateVersement: { type: Date, required: true, default: Date.now },
    },
  ],
  comments: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
});

// Middleware to log actions
versementSchema.pre("save", async function (next) {
  console.log("save", this);
  if (this.isNew) {
    // If a new record is being created
    this.user = this.user; // Replace with the actual user ID or username
  } else {
    // If an existing record is being updated
    this.updatedBy = this.updatedBy; // Replace with the actual user ID or username
    this.updatedAt = new Date();
  }

  await logMiddleware(
    this.user,
    "delete",
    this.montants[0].locataire,
    "versement",
    false,
    null,
    null
  );

  next();
});

versementSchema.pre("findOneAndUpdate", async function (next) {
  const dates = [];
  const obj = this._update["$set"];
  // console.log("this is ...", this);

  const updateLocataires = async (locataireId, sumAmount, action) => {
    const montant = Number(Object.values(obj)[0]);
    const locataire = await Locataire.findById(locataireId);
    // console.log(sumAmount, "sum amount");
    const dateEntry = new Date(locataire.date);
    const totalAmount = Number(locataire.montant);
    const monthDifference = getMonthDifference(dateEntry, new Date(Date.now()));
    const annee = Math.floor(monthDifference / 12);

    const filter = { _id: locataire._id };

    const rentAmount =
      locataire.num[1] === "A" || locataire.num[2] === "A"
        ? 15000
        : locataire.num[1] === "B" || locataire.num[2] === "B"
        ? 12000
        : 25000;

    const newDebts =
      action === "update"
        ? totalAmount -
          sumAmount +
          montant -
          (monthDifference - 2 * annee) * rentAmount
        : totalAmount + montant - (monthDifference - 2 * annee) * rentAmount;
    const updateFields = {
      $set: {
        months: monthDifference,
        debts: newDebts,
        montant:
          action === "update"
            ? totalAmount + montant - sumAmount
            : totalAmount + montant,
      },
    };
    console.log(" try  ", totalAmount);
    console.log(" try  m", montant);
    console.log(" try s ", sumAmount);
    const result = await Locataire.updateOne(filter, updateFields);
    dates.push({
      months: monthDifference,
      debts: newDebts,
      totalAmount:
        action === "update"
          ? totalAmount + montant - sumAmount
          : totalAmount + montant,
      result: result, // Store the result of the update
    });

    // Wait for all update promises to resolve
    // const updateResults = await Promise.all(updatePromises);

    // Output the dates array if needed
    console.log("dates...", dates);
  };
  // console.log(this._update["$push"]);
  if (this._conditions["montants._id"]) {
    async function getLocataireId(versementId, montantId) {
      try {
        const foundVersement = await Versement.findOne(
          {
            _id: versementId,
            "montants._id": montantId,
          },
          "montants.$"
        ).exec();

        if (foundVersement) {
          const locataireId = foundVersement.montants[0].locataire;
          const montantLoc = Number(foundVersement.montants[0].value);
          // console.log("Locataire ID for the specified montant:", locataireId);
          return { locataireId, montantLoc };
        } else {
          console.log("Versement not found.");
        }
      } catch (err) {
        console.error("Error finding versement:", err);
      }
    }
    const locataireDetails = await getLocataireId(
      this._conditions._id,
      this._conditions["montants._id"]
    );
    const { locataireId, montantLoc } = locataireDetails;

    updateLocataires(locataireId, montantLoc, "update");

    await logMiddleware(
      userId._id,
      "update",
      locataireId,
      "versement",
      false,
      null,
      null
    );
  } else {
    // const versementId = this._conditions._id;
    // const versement = await Versement.findById(versementId);
    // const locataireId = versement.montants[0].locataire;
    // // console.log("t", versement.montants[0], "okay");
    // updateLocataires(locataireId, 0, "create");
    await logMiddleware(
      userId._id,
      "create",
      this._update["$push"].montants.locataire,
      "versement",
      false,
      null,
      null
    );
  }

  // console.log(userId._id, locataireId);

  next();
});

// Middleware to log actions
versementSchema.pre("UpdateOne", async function (next) {
  console.log("deletion");
  async function getLocataireId(versementId, montantId) {
    try {
      const foundVersement = await Versement.findOne(
        {
          _id: versementId,
          "montants._id": montantId,
        },
        "montants.$"
      ).exec();

      if (foundVersement) {
        const locataireId = foundVersement.montants[0].locataire;
        // console.log("Locataire ID for the specified montant:", locataireId);
        return locataireId;
      } else {
        console.log(foundVersement, "Versement notttt found.");
      }
    } catch (err) {
      console.error("Error finding versement:", err);
    }
  }
  const locataireId = await getLocataireId(
    this._conditions._id,
    this._conditions["montants._id"]
  );

  await logMiddleware(
    userId._id,
    "delete",
    locataireId,
    "versement",
    false,
    null,
    null
  );
  next();
});

const Versement = mongoose.model("Versement", versementSchema);
export default Versement;
