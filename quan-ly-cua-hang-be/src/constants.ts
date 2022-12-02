import * as dotenv from "dotenv";
dotenv.config();

export const SECRETKEY_ACCESS = process.env.JWT_SECRETKEY_ACCESS || "SECRETKEY";
export const EXPRIRESIN_ACCESS = process.env.EXPRIRESIN_ACCESS || "1d";
export const URL_IMAGE = process.env.URL_IMAGE || "http://localhost:8000/api/";
