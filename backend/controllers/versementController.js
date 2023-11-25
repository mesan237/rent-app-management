import Versement from "../models/versementModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getVersements = asyncHandler(async (req, res) => {
  const listeVersements = await Versement.find({});
  res.json(listeVersements);
});

const createVersements = asyncHandler(async (req, res) => {
  const { name, tel, date, montant, num, comments } = req.body;

  const versementExists = await Versement.findOne({
    num: { $regex: new RegExp(num, "i") },
    name: { $regex: new RegExp(name, "i") },
  });
  // res.json(VersementExists);
  // console.log(VersementExists);

  if (versementExists) {
    res.status(401);
    throw new Error(" this tenant already exist in the database!!!");
  } else {
    const versement = await Versement.create({
      user: req.user._id,
      name,
      tel,
      date,
      montant,
      num,
      comments,
    });
    if (versement) {
      res.status(201).json({
        user: versement.user,
        _id: versement._id,
        num: versement.num,
        name: versement.name,
        tel: versement.tel,
        montant: versement.montant,
        date: versement.date,
        comments: versement.comments,
        debts: versement.debts,
        months: versement.months,
      });
    }
  }
});

const deleteVersements = asyncHandler(async (req, res) => {
  const { num, name, tel, date, comments, months, debts } = req.body;

  // find the Versement
  const versement = await Versement.findById(req.params.id);
  if (versement) {
    versement.num = num;
    versement.name = null;
    versement.tel = null;
    versement.months = null;
    versement.date = null;
    versement.debts = null;
    versement.comments = null;

    const updatedVersement = await versement.save();
    res.json(updatedVersement);
  } else {
    res.status(400);
    throw new Error("Versement not found for a possible update");
  }
});

const getVersementById = asyncHandler(async (req, res) => {
  const versement = await Versement.findById(req.params.id);

  if (versement) {
    res.json(versement);
  } else {
    res.status(400);
    throw new Error("Versement pas trouvé");
  }
});

// modifier les donnees d'un Versement
const updateVersement = asyncHandler(async (req, res) => {
  const { num, name, tel, date, comments, montant } = req.body;

  // find the Versement
  const versement = await Versement.findById(req.params.id);
  if (versement) {
    versement.num = num;
    versement.montant = montant;
    versement.name = name;
    versement.tel = tel;
    versement.date = date;
    versement.comments = comments;

    const updatedVersement = await versement.save();
    res.json(updatedVersement);
  } else {
    res.status(400);
    throw new Error("Versement not found for a possible update");
  }
});

export {
  getVersements,
  createVersements,
  deleteVersements,
  updateVersement,
  getVersementById,
};
