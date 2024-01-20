import app from "../app.js";
import supertest from "supertest";

export const request = supertest(app);
