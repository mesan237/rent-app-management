import Locataire from "../models/locataireModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getLocataires = asyncHandler(async (req, res) => {
  const listesLocataires = await Locataire.find({});
  res.json(listesLocataires);
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
function getMonthDifference(startDate, endDate) {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  return (endYear - startYear) * 12 + (endMonth - startMonth);
}

const updateFieldsForAllTenants = asyncHandler(async (req, res) => {
  const listesLocataires = await Locataire.find({});
  const dates = [];
  const updateLocataires = async () => {
    const updatePromises = listesLocataires.map(async (locataire) => {
      const dateEntry = new Date(locataire.date);
      const totalAmount = locataire.montant;
      const monthDifference = getMonthDifference(
        dateEntry,
        new Date(Date.now())
      );
      const annee = Math.floor(monthDifference / 12);

      const filter = { _id: locataire._id };

      const rentAmount =
        locataire.num[1] === "A"
          ? 15000
          : locataire.num[1] === "B"
          ? 12000
          : 25000;

      const newDebts = totalAmount - (monthDifference - 2) * annee * rentAmount;
      const updateFields = {
        $set: {
          months: monthDifference,
          debts: newDebts,
        },
      };

      const result = await Locataire.updateOne(filter, updateFields);
      dates.push({
        months: monthDifference,
        debts: newDebts,
        totalAmount: totalAmount,
        result: result, // Store the result of the update
      });

      return result; // Return the result to be used by Promise.all
    });

    // Wait for all update promises to resolve
    const updateResults = await Promise.all(updatePromises);

    // Output the dates array if needed
    console.log(dates);
    // res.json(dates);
  };

  updateLocataires();
});

export {
  getLocataires,
  createLocataires,
  deleteLocataires,
  updateLocataires,
  getLocataireById,
  updateFieldsForAllTenants,
};
