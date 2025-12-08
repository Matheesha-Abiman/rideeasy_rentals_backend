import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
//import authRouter from "./routes/auth"
import { Role } from "./models/user.model";
import authRouter from "./routes/auth";
import bikeRouter from "./routes/bike";
import paymentRouter from "./routes/payment";
import rentalRouter from "./routes/rental";
import { authenticate } from "./middleware/auth";
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI as string;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"], // optional
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/bike", authenticate, bikeRouter);
app.use("/api/v1/rental", authenticate, rentalRouter);
app.use("/api/v1/payment", authenticate, paymentRouter);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log("Server is running");
});
