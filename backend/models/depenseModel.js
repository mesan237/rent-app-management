import mongoose from "mongoose";

const depenseSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  designation: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  batiment: {
    type: String,
    enum: ["A", "B"],
    required: true,
  },
  categorie: {
    type: String,
    required: true,
  },
  montant: {
    type: Number,
    required: true,
  },
  comments: String,
});

const Depense = mongoose.model("Depense", depenseSchema);
export default Depense;
