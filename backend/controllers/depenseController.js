import Depense from "../models/depenseModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getDepenses = asyncHandler(async (req, res) => {
  try {
    const listesDepenses = await Depense.find({});
    res.json(listesDepenses);
  } catch (error) {
    console.error("Error in getDepenses:", error);

    res.status(401);
    throw new Error(" Probleme d'affichage au niveau du serveur!");
  }
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
        user: createdDepense.user,
        _id: createdDepense._id,
        batiment: createdDepense.batiment,
        designation: createdDepense.designation,
        date: createdDepense.date,
        montant: createdDepense.montant,
        comments: createdDepense.comments,
        categorie: createdDepense.categorie,
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
    throw new Error("Depense pas trouvée");
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
    throw new Error(
      "La depense n'a pas été trouvée pour une eventeulle mise à jour!"
    );
  }
});

export { getDepenses, createDepenses, modifierDepenses, getDepenseById };
