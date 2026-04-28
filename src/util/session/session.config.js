import session from "express-session";
import { EXPRESS_SESSION_KEY } from "../../../config/app.config.js";

export function expressSession()
{
    return session({
        secret: EXPRESS_SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 1, // milliseconds * seconds * minutes = 1 min
            sameSite: true
        }
    });
}