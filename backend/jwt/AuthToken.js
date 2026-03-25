import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const createToken = async (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });

  await User.findByIdAndUpdate(userId, { token });
  return token;
};

export default createToken;