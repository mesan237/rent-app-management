import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import locatairesRoutes from "./routes/locatairesRoutes.js";
import depensesRoutes from "./routes/depensesRoutes.js";
import usersRoutes from "./routes/userRoutes.js";
import logsRoutes from "./routes/logsRoutes.js";
import versementsRoutes from "./routes/versementsRoutes.js";
import { updateFieldsForAllTenants } from "./controllers/locataireController.js";

const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/locataires", locatairesRoutes);
app.use("/api/depenses", depensesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/versement", versementsRoutes);

cron.schedule("0 0 28 * *", () => {
  console.log("Running updateLocataires function...");
  updateFieldsForAllTenants();
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on port ${port}...`));
