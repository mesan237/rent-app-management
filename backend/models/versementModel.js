import mongoose from "mongoose";
import { logMiddleware } from "../middleware/logMiddleware.js";
import { userId } from "../controllers/versementController.js";

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
  console.log(this._update["$push"].montants.locataire);
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
          // console.log("Locataire ID for the specified montant:", locataireId);
          return locataireId;
        } else {
          console.log("Versement not found.");
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
      "update",
      locataireId,
      "versement",
      false,
      null,
      null
    );
  } else {
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
