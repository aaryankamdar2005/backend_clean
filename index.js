import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import connectDb from "./config/connect.js";
import cookieParser from "cookie-parser";
import { ChatGroq } from "@langchain/groq"; 
import langchainRoutes from "./routes/langChainRoutes.js";
import screenRouter from "./routes/screenRoutes.js";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cookieParser());
connectDb();


app.use(
  cors({
    origin: "*", 
 
  })
);

app.get("/", (req, res) => res.send("works"));
app.use("/api/user", userRoutes);
app.use("/api",langchainRoutes);
app.use("/api/screen",screenRouter);

app.listen(PORT, () => console.log(` Server started on port ${PORT}`));
