import mongoose from "mongoose";

const logSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", logSchema);
export default Log;
