import express from "express";
import { loginUser, registerUser, updateUser, userDetails } from "../controllers/userController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get(`/details/:user_id`,authenticate,userDetails);
router.post(`/update`,authenticate,updateUser);

export default router;
