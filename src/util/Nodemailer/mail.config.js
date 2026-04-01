import fs from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { GOOGLE_APP_PASSWORD, GOOGLE_NODEMAILER_USER } from "../../../config/app.config.js";
import { ResponseError } from "../Res/ResponseError.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GOOGLE_NODEMAILER_USER,
        pass: GOOGLE_APP_PASSWORD
    },
});


/**
 * @param {{ email: string, username: string, reason: string, otp: string }} emailOptions 
 */
export async function sendMail({ email, username, reason, otp })
{
    try
    {
        const htmlFilePath = path.resolve("src/util/Nodemailer/mailTemplate.html");
        let htmlFileContent = await fs.readFile(htmlFilePath, "utf-8");

        htmlFileContent = htmlFileContent.replace("[username]", username);
        htmlFileContent = htmlFileContent.replace("[reason]", reason);
        htmlFileContent = htmlFileContent.replace("[otp]", otp);

        const subject = reason.split(" ").map(word => word.slice(0, 1).toUpperCase() + word.slice(1)).join(" ");

        const info = await transporter.sendMail({
            from: '"Saraha Team" <info@saraha.com>',
            to: email,
            subject: subject,
            html: htmlFileContent,
        });

    }
    catch (err)
    {
        throw new ResponseError("Error while sending mail", 500, err);
    }
}