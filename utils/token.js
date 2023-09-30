import jwt from "jsonwebtoken";

export const createToken = async (user_id, user_email) => {
  try {
    const token = await jwt.sign(
      { user_id, user_email },
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn: process.env.JWT_TOKEN_EXPIRY,
      });
      return token;
  } catch (error) {
    return false;
  }
};

export const verifyToken = async (token) => {};
