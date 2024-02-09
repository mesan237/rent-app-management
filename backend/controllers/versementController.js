import Versement from "../models/versementModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Locataire from "../models/locataireModel.js";
import User from "../models/userModel.js";

export let userId;

function getMonthDifference(startDate, endDate) {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  return (endYear - startYear) * 12 + (endMonth - startMonth);
}

const getVersements = asyncHandler(async (req, res, next) => {
  try {
    const listeVersements = await Versement.find({});
    req.versement = listeVersements;
    next();
  } catch (error) {
    // Handle the error if necessary
    res.status(500);
    throw new Error("Probleme d'affichage !");
  }
});

const getDetailsVersements = asyncHandler(async (req, res) => {
  const listVersements = req.versement;
  const updatedVersements = [];

  const userIds = listVersements.map((versement) => versement.user);
  const locataireIds = listVersements.flatMap((versement) =>
    versement.montants.map((amt) => amt.locataire)
  );

  const [users, locataires] = await Promise.all([
    User.find({ _id: { $in: userIds } }, { name: 1 }),
    Locataire.find({ _id: { $in: locataireIds } }, { name: 1 }),
  ]);

  for (const versement of listVersements) {
    try {
      const montants = versement.montants;
      const amount = [];

      for (const amt of montants) {
        const locataireDetails = locataires.find((locataire) =>
          locataire._id.equals(amt.locataire)
        );
        amount.push({
          _id: amt._id,
          nameLocataire: locataireDetails.name,
          versement: amt.value,
          date: amt.dateVersement,
        });
      }

      const userDetails = users.find((user) => user._id.equals(versement.user));

      updatedVersements.push({
        _id: versement._id,
        comments: versement.comments,
        user: userDetails.name,
        nbrVersement: versement.montants.length,
        totalAmount: amount.reduce((sum, item) => sum + item.versement, 0),
        historique: amount,
      });
    } catch (error) {
      console.error(`Error processing log ${versement._id}: ${error.message}`);
      updatedVersements.push({
        versementId: versement._id,
        error: true,
        errorMessage: error.message,
      });
    }
  }

  res.json(updatedVersements);
});

const createVersements = asyncHandler(async (req, res) => {
  const { date, montant, num } = req.body;
  const dates = [];

  const locataire = await Locataire.findOne({ num });
  // res.json(VersementExists);

  const versement = await Versement.findOne({
    "montants.locataire": locataire._id,
  });
  const amount = Number(montant);

  const updateLocataires = async () => {
    const dateEntry = new Date(locataire.date);
    const totalAmount = Number(locataire.montant);
    const monthDifference = getMonthDifference(dateEntry, new Date(Date.now()));
    const annee = Math.floor(monthDifference / 12);

    const filter = { _id: locataire._id };

    const rentAmount =
      locataire.num[1] === "A" || locataire.num[2] === "A"
        ? 15000
        : locataire.num[1] === "B" || locataire.num[2] === "B"
        ? 12000
        : 25000;

    const newDebts =
      totalAmount + amount - (monthDifference - 2 * annee) * rentAmount;
    const updateFields = {
      $set: {
        months: monthDifference,
        debts: newDebts,
        montant: totalAmount + amount,
      },
    };

    const result = await Locataire.updateOne(filter, updateFields);
    dates.push({
      months: monthDifference,
      debts: newDebts,
      totalAmount: totalAmount + amount,
      // result: result, // Store the result of the update
    });
    // Wait for all update promises to resolve
    // const updateResults = await Promise.all(updatePromises);

    // Output the dates array if needed
    console.log("dates...", dates);
    res.json(dates);
    return result;
  };

  const versementId = versement._id;
  console.log("Versement ID:", versementId);

  const newMontant = {
    type: "payment",
    value: montant,
    locataire: locataire._id,
    dateVersement: date,
  };
  userId = req.user;
  // console.log(VersementExists);
  try {
    updateLocataires();
    const updatedVersement = await Versement.findOneAndUpdate(
      { _id: versementId },
      {
        $push: {
          montants: {
            type: "payment",
            value: montant,
            locataire: locataire._id,
            dateVersement: date,
          },
        },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    );

    if (updatedVersement) {
      console.log("Versement updated successfully:", updatedVersement);
      return updatedVersement;
    } else {
      console.log("No Versement found for the specified ID.");
      return null;
    }
  } catch (error) {
    console.error("Error updating Versement:", error);
    throw error;
  }
});

const deleteVersements = asyncHandler(async (req, res) => {
  const [montantId, versementId] = req.params.id.split("-");

  userId = req.user;

  async function deleteMontant(versementId, montantId) {
    try {
      const updatedVersement = await Versement.updateOne(
        { _id: versementId },
        { $pull: { montants: { _id: montantId } } }
      );

      if (updatedVersement.nModified === 0) {
        throw new Error("Montant not found in Versement");
      }

      console.log("Montant deleted successfully");
    } catch (error) {
      console.error("Error deleting montant:", error);
      throw error;
    }
  }
  deleteMontant(versementId, montantId);
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

// I neded a userId for logs

// modifier les donnees d'un Versement
const updateVersement = asyncHandler(async (req, res) => {
  const { date, montant } = req.body;
  const [montantId, versementId] = req.params.id.split("-");
  // console.log(date);
  userId = req.user;
  const dates = [];
  console.log("req.body ...", req.body);

  const updateLocataires = async () => {
    const versement = await Versement.findById(versementId);
    const locataireId = versement.montants[0].locataireId;
    const locataire = await Locataire.findById(locataireId);

    const dateEntry = new Date(locataire.date);
    const totalAmount = locataire.montant;
    const monthDifference = getMonthDifference(dateEntry, new Date(Date.now()));
    const annee = Math.floor(monthDifference / 12);

    const filter = { _id: locataire._id };

    const rentAmount =
      locataire.num[1] === "A" || locataire.num[2] === "A"
        ? 15000
        : locataire.num[1] === "B" || locataire.num[2] === "B"
        ? 12000
        : 25000;

    const newDebts =
      totalAmount + montant - (monthDifference - 2 * annee) * rentAmount;
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

    // Wait for all update promises to resolve
    // const updateResults = await Promise.all(updatePromises);

    // Output the dates array if needed
    console.log("dates...", dates);
    res.json(dates);
  };
  // faire la requette pour recuperer l'ancient montant total
  // 2 - recalculer ses dettes
  // 3 - Faire la somme du nouveau montant
  // 4- ecrire une requette pour sauvegarder les données
  try {
    // updateLocataires();
    // Use findOneAndUpdate to find the versement and update the specific montant
    const updatedVersement = await Versement.findOneAndUpdate(
      {
        _id: versementId,
        "montants._id": montantId, // Match the specific montant within the array
      },
      {
        $set: {
          "montants.$.value": montant, // Update the 'value' field of the matched montant
          updatedAt: Date.now(), // Update the updatedAt field of the versement
          // "montants.$.dateVersement": date,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedVersement) {
      throw new Error("Versement or Montant not found");
    }

    console.log("Updated Versement:", updatedVersement);
    return updatedVersement;
  } catch (error) {
    console.error("Error updating montant:", error);
    throw error;
  }
});

export {
  getVersements,
  createVersements,
  deleteVersements,
  updateVersement,
  getVersementById,
  getDetailsVersements,
};
