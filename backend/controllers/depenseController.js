import Depense from "../models/depenseModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getDepenses = asyncHandler(async (req, res) => {
  const listesDepenses = await Depense.find({});
  res.json(listesDepenses);
});

const createDepenses = asyncHandler(async (req, res) => {
  const { designation, date, batiment, categorie, montant, comments } =
    req.body;

  const depenseExists = await Depense.findOne({
    categorie: { $regex: new RegExp(categorie, "i") },
    batiment: { $regex: new RegExp(batiment, "i") },
    montant,
  });

  if (depenseExists) {
    res.status(401);
    throw new Error(" that expense already exist in the database");
  } else {
    const createdDepense = await Depense.create({
      user: req.user._id,
      designation,
      date,
      batiment,
      categorie,
      montant,
      comments,
    });
    if (createdDepense) {
      res.status(201).json({
        user: createDepenses.user,
        _id: createDepenses._id,
        batiment: createDepenses.batiment,
        designation: createDepenses.designation,
        date: createDepenses.date,
        montant: createDepenses.montant,
        comments: createDepenses.comments,
        categorie: createDepenses.categorie,
      });
    }
  }
});

const getDepenseById = asyncHandler(async (req, res) => {
  const depense = await Depense.findById(req.params.id);

  if (depense) {
    res.json(depense);
  } else {
    res.status(400);
    throw new Error("Depense pas trouvé");
  }
});

const deleteDepenses = asyncHandler(async (req, res) => {});

const modifierDepenses = asyncHandler(async (req, res) => {
  const { designation, date, batiment, categorie, montant, comments } =
    req.body;

  // find the expense
  const depense = await Depense.findById(req.params.id);
  if (depense) {
    depense.designation = designation;
    depense.date = date;
    depense.batiment = batiment;
    depense.categorie = categorie;
    depense.montant = montant;
    depense.comments = comments;

    const updatedDepense = await depense.save();
    res.json(updatedDepense);
  } else {
    res.status(400);
    throw new Error("expense not found for a possible update");
  }
});

export { getDepenses, createDepenses, modifierDepenses, getDepenseById };
