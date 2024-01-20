import { loadEnv } from "../app/supports/helpers.js";

loadEnv();

export default {
  secret: process.env.JWT_SECRET,

  algorithm: process.env.JWT_ALGORITHM || "HS256",
  expiresIn: process.env.JWT_EXPIRES_IN || "1d",
};
