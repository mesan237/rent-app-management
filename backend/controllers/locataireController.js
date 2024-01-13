import Locataire from "../models/locataireModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getLocataires = asyncHandler(async (req, res, next) => {
  console.log(req.query.total);
  if (req.query.total) {
    console.log("ok next ...");
    const filterB = { name: { $exists: true }, num: { $regex: /B/i } }; // Case-insensitive regex for letter "B"
    const filterA = { name: { $exists: true }, num: { $regex: /A/i } }; // Case-insensitive regex for letter "A"

    const countWithB = await Locataire.countDocuments(filterB);
    const countWithA = await Locataire.countDocuments(filterA);

    if (countWithA && countWithB) {
      res.status(200).json({ A: countWithA, B: countWithB });
    } else {
      res.status(404);
      throw new Error("failed to get the total");
    }
  } else {
    const listesLocataires = await Locataire.find({});
    res.json(listesLocataires);
  }
});

const createLocataires = asyncHandler(async (req, res) => {
  const { name, tel, date, montant, num, comments } = req.body;

  const locataireExists = await Locataire.findOne({
    num: { $regex: new RegExp(num, "i") },
    name: { $regex: new RegExp(name, "i") },
  });

  const roomExists = await Locataire.findOne({ num });
  const locataireFields = {
    user: req.user._id,
    name,
    tel,
    date,
    montant,
    comments,
    createdAt: new Date(),
  };
  if (locataireExists) {
    res.status(401);
    throw new Error(" Ce locataire existe déja dans la base de données!!!");
  } else if (roomExists && roomExists.deletedAt) {
    let newMonths = getMonthDifference(new Date(date), new Date());
    const annee = Math.floor(newMonths / 12);
    const rentAmount =
      num[1] === "A" || num[2] === "A"
        ? 15000
        : num[1] === "B" || num[2] === "B"
        ? 12000
        : 25000;

    let newDebts = montant - (newMonths - 2 * annee) * rentAmount;
    newDebts = newDebts > 0 ? 0 : newDebts;
    console.log(newMonths, rentAmount, num[1]);

    const softCreatedLocataire = await Locataire.findOneAndUpdate(
      { _id: roomExists._id },
      {
        ...locataireFields,
        months: newMonths,
        debts: newDebts,
        $unset: { deletedAt: 1 },
      },
      { new: true, runValidators: true }
    );
    res.status(201).json(softCreatedLocataire);
  } else {
    const locataire = await Locataire.create({ ...locataireFields, num });
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
  const locataireId = req.params.id;
  try {
    const updateFields = {
      $unset: {
        name: 1,
        tel: 1,
        date: 1,
        months: 1,
        montant: 1,
        debts: 1,
        comments: 1,
        createdAt: 1,
      },
      user: req.user._id,
      deletedAt: new Date(),
    };

    const softDeletedLocataire = await Locataire.findOneAndUpdate(
      { _id: locataireId },
      updateFields,
      { new: true } // Return the modified document
    );

    console.log("Locataire soft deleted:", softDeletedLocataire);
    res.json(softDeletedLocataire);
  } catch (error) {
    console.error("Error soft deleting locataire:", error);
    throw error;
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
    throw new Error("Locataire pas trouvé pour une eventuelle modification");
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
        locataire.num[1] === "A" || locataire.num[2] === "A"
          ? 15000
          : locataire.num[1] === "B" || locataire.num[2] === "B"
          ? 12000
          : 25000;

      const newDebts = totalAmount - (monthDifference - 2 * annee) * rentAmount;
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
