import jwt from "jsonwebtoken";
import { User } from "../modals/userModal.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
   
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please login to your account",
      });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userExists = await User.findOne({ user_id: decodedToken.user_id });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "No such user Exists",
      });
    }
    req.userId = userExists.user_id;
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
