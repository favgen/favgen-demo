import { cleanEnv, port, str, num } from "envalid";

export default function validateEnv() {
  cleanEnv(process.env, {
    DOMAIN_NAME: str(),
    NODE_ENV: str(),
    PORT: port(),
    UPLOAD_MAX_SIZE_BYTES: num(),
  });
}
