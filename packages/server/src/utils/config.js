import "dotenv/config";
import validateEnv from "./validateEnv.js";

validateEnv();

const { DOMAIN_NAME, ENV } = process.env;
const PORT = Number(process.env.PORT);
const UPLOAD_MAX_SIZE_BYTES = Number(process.env.UPLOAD_MAX_SIZE_BYTES);

export { DOMAIN_NAME, ENV, PORT, UPLOAD_MAX_SIZE_BYTES };
