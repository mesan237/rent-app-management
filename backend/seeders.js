import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { listesLocataires, listesDepenses } from "./datas/constants.js";
import users from "./datas/users.js";
import Locataire from "./models/locataireModel.js";
import User from "./models/userModel.js";
import Depense from "./models/depenseModel.js";

dotenv.config();

await connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Depense.deleteMany();
    await Locataire.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleLocataire = listesLocataires.map((locataire) => {
      return { ...locataire, user: adminUser };
    });
    const sampleDepense = listesDepenses.map((depense) => {
      return { ...depense, user: adminUser };
    });

    await Locataire.insertMany(sampleLocataire);
    await Depense.insertMany(sampleDepense);

    console.error("Data imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    await Depense.deleteMany();
    await User.deleteMany();
    await Locataire.deleteMany();

    console.error("Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
