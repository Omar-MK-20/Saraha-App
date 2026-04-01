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



export async function sendMail({ email, username, reason, otp })
{
    try
    {
        const htmlFilePath = path.resolve("src/util/Nodemailer/mailTemplate.html");
        let htmlFileContent = await fs.readFile(htmlFilePath, "utf-8");

        htmlFileContent = htmlFileContent.replace("[username]", username)
        htmlFileContent = htmlFileContent.replace("[reason]", reason)
        htmlFileContent = htmlFileContent.replace("[otp]", otp)

        const info = await transporter.sendMail({
            from: '"Example Team" <team@example.com>', // sender address
            to: email, // list of recipients
            subject: "Hello", // subject line
            text: "Hello world?", // plain text body
            html: htmlFileContent, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err)
    {
        console.error("Error while sending mail:", err);
        throw new ResponseError("Error while sending mail", 500, err);
    }
}