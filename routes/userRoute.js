import express from "express";
import { getImage, insertUser, loginUser, updateUser, userDetails } from "../controllers/userController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register",insertUser);
router.post("/login",loginUser);
router.get(`/details/:user_id`,authenticate,userDetails);
router.post(`/update`,authenticate,updateUser);
router.get(`/images/:user_id`,authenticate,getImage);

export default router;
