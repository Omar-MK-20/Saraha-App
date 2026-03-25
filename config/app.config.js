import dotenv from 'dotenv';
import path from 'node:path';


dotenv.config({ path: path.resolve("./config/.env.dev") });

export const SEVER_PORT = process.env.SEVER_PORT;
export const DB_URI = process.env.DB_URI;
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
export const TOKEN_SIGNATURE_ADMIN_ACCESS = process.env.TOKEN_SIGNATURE_ADMIN_ACCESS;
export const TOKEN_SIGNATURE_USER_ACCESS = process.env.TOKEN_SIGNATURE_USER_ACCESS;
export const TOKEN_SIGNATURE_ADMIN_REFRESH = process.env.TOKEN_SIGNATURE_ADMIN_REFRESH;
export const TOKEN_SIGNATURE_USER_REFRESH = process.env.TOKEN_SIGNATURE_USER_REFRESH;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;