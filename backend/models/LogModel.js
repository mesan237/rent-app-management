import mongoose from "mongoose";

const logSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  locataireDetails: {
    num: { type: String },
    name: { type: String },
    tel: { type: Number },
    montantTotal: { type: Number },
    entryDate: { type: Date },
  },
  userEmail: { type: String },
  action: {
    type: String,
    enum: ["update", "create", "delete"],
    required: true,
  },
  categorie: {
    type: String,
    enum: ["versement", "locataire", "utilisateur", "depense"],
    required: true,
  },
  recordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Locataire",
    required: true,
  },
  changes: { type: Object }, // Store the changes made to the record
  isLocataireDeleted: { type: Boolean, default: false },
  isUserDeleted: { type: Boolean },
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", logSchema);
export default Log;
