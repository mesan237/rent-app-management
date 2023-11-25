import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
// import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import locatairesRoutes from "./routes/locatairesRoutes.js";
import depensesRoutes from "./routes/depensesRoutes.js";
import usersRoutes from "./routes/userRoutes.js";
import logsRoutes from "./routes/logsRoutes.js";
import versementsRoutes from "./routes/versementsRoutes.js";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/locataires", locatairesRoutes);
app.use("/api/depenses", depensesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/versement", versementsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on port ${port}...`));
