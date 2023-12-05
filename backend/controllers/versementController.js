import Versement from "../models/versementModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Locataire from "../models/locataireModel.js";
import User from "../models/userModel.js";

export let userId;

const getVersements = asyncHandler(async (req, res, next) => {
  const listeVersements = await Versement.find({});
  // res.json(listeVersements);
  req.versement = listeVersements;
  next();
});

const getDetailsVersements = asyncHandler(async (req, res, next) => {
  const listVersements = req.versement;
  const updatedVersements = [];

  for (const versement of listVersements) {
    try {
      const montants = versement.montants;
      const amount = [];
      const userDetails = await User.findById(versement.user);

      for (const amt of montants) {
        const locataireDetails = await Locataire.findById(amt.locataire);
        amount.push({
          _id: amt._id,
          nameLocataire: locataireDetails.name,
          versement: amt.value,
          date: amt.dateVersement,
        });
      }

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

  const locataire = await Locataire.findOne({ num });
  // res.json(VersementExists);

  const versement = await Versement.findOne({
    "montants.locataire": locataire._id,
  });

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
  try {
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
          "montants.$.dateVersement": date,
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
