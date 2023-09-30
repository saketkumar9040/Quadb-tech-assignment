import jwt from "jsonwebtoken";

export const createToken = async (user_id, user_email) => {
  try {
    const token = jwt.sign(
      { user_id, user_email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000,
      }
    );
    return token;
  } catch (error) { 
    throw new Error(error);
  }
};

export const verifyToken = async (token) => {};
