import express from "express"
import generator from "../controllers/langChain.js";

const langchainRoutes = express.Router();

langchainRoutes.post("/generate",generator);

export default langchainRoutes;
