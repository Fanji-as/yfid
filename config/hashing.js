import { loadEnv } from "../app/supports/helpers.js";

loadEnv();

export default {
  bcrypt_rounds: Number(process.env.BCRYPT_ROUNDS || "10"),
};
