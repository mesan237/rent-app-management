import Locataire from "../models/locataireModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getLocataires = asyncHandler(async (req, res) => {
  try {
    const listesLocataires = await Locataire.find({});
    res.json(listesLocataires);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const createLocataires = asyncHandler(async (req, res) => {
  const { name, tel, date, montant, num, comments } = req.body;

  const locataireExists = await Locataire.findOne({
    num: { $regex: new RegExp(num, "i") },
    name: { $regex: new RegExp(name, "i") },
  });
  // res.json(locataireExists);
  // console.log(locataireExists);

  if (locataireExists) {
    res.status(401);
    throw new Error(" this tenant already exist in the database!!!");
  } else {
    const locataire = await Locataire.create({
      user: req.user._id,
      name,
      tel,
      date,
      montant,
      num,
      comments,
    });
    if (locataire) {
      res.status(201).json({
        user: locataire.user,
        _id: locataire._id,
        num: locataire.num,
        name: locataire.name,
        tel: locataire.tel,
        montant: locataire.montant,
        date: locataire.date,
        comments: locataire.comments,
        debts: locataire.debts,
        months: locataire.months,
      });
    }
  }

  /*const locataire = new Locataire({
    num: "15A",
    user: req.user._id,
    name: "nego",
    tel: "651234567",
    date: "08-20-2020",
    montant: 120000,
    comments: "Besoin d'une extension de délai pour le paiement.",
  });*/

  //find if he exists
});

const deleteLocataires = asyncHandler(async (req, res) => {
  const { num, name, tel, date, comments, months, debts } = req.body;

  // find the locataire
  const locataire = await Locataire.findById(req.params.id);
  if (locataire) {
    locataire.num = num;
    locataire.name = null;
    locataire.tel = null;
    locataire.months = null;
    locataire.date = null;
    locataire.debts = null;
    locataire.comments = null;

    const updatedLocataire = await locataire.save();
    res.json(updatedLocataire);
  } else {
    res.status(400);
    throw new Error("Locataire not found for a possible update");
  }
});

const getLocataireById = asyncHandler(async (req, res) => {
  const locataire = await Locataire.findById(req.params.id);

  if (locataire) {
    res.json(locataire);
  } else {
    res.status(400);
    throw new Error("Locataire pas trouvé");
  }
});

// modifier les donnees d'un locataire
const updateLocataires = asyncHandler(async (req, res) => {
  const { num, name, tel, date, comments, montant } = req.body;

  // find the locataire
  const locataire = await Locataire.findById(req.params.id);
  if (locataire) {
    locataire.num = num;
    locataire.montant = montant;
    locataire.name = name;
    locataire.tel = tel;
    locataire.date = date;
    locataire.comments = comments;

    const updatedLocataire = await locataire.save();
    res.json(updatedLocataire);
  } else {
    res.status(400);
    throw new Error("Locataire not found for a possible update");
  }
});

export {
  getLocataires,
  createLocataires,
  deleteLocataires,
  updateLocataires,
  getLocataireById,
};
