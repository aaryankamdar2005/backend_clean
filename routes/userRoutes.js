import express from "express"; 
import { handleLogin, handleSignup } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/login", handleLogin);
userRoutes.post("/signup", handleSignup);

export default userRoutes; 
