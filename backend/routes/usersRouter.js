import express from "express";
import { registerUser, loginUser } from "../controllers/usersControllers.js"

//delete later use just to test route
import { getPreferences } from "../controllers/preferenceController.js";

const router = express.Router();



router.post("/register", registerUser);

router.post('/login', loginUser);



export default router;


