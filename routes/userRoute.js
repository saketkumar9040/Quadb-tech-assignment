import express from "express";
import { loginUser, registerUser, userDetails } from "../controllers/userController.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get(`/details/:user_id`,userDetails);

export default router;