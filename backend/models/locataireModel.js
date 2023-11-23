import mongoose from "mongoose";

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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  num: {
    type: String,
    enum: chambres, // Enum values based on the defined list
    default: "1A", // Default value
  },
  name: {
    type: String,
    required: true,
  },
  tel: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  months: {
    type: Number,
    required: true,
  },
  montant: {
    type: Number,
    required: true,
  },
  debts: {
    type: Number,
    required: true,
  },
  comments: String,
});

locataireSchema.pre("validate", async function (next) {
  if (!this.date) {
    next();
  }
  this.months = getMonthDifference(this.date, new Date());
  const annee = Math.floor(this.months % 12);
  const rentAmount =
    this.num[1] === "A" ? 15000 : this.num[1] === "B" ? 12000 : 25000;

  if (this.montant !== undefined && this.months !== undefined) {
    this.debts = this.montant - (this.months - 2 * annee) * rentAmount;
  }
});

const Locataire = mongoose.model("Locataire", locataireSchema);
export default Locataire;
