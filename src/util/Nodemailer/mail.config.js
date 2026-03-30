import nodemailer from "nodemailer";
import { GOOGLE_APP_PASSWORD, GOOGLE_NODEMAILER_USER } from "../../../config/app.config.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GOOGLE_NODEMAILER_USER,
        pass: GOOGLE_APP_PASSWORD
    },
});


try
{
    const info = await transporter.sendMail({
        from: '"Example Team" <team@example.com>', // sender address
        to: "omar200ram@gmail.com", // list of recipients
        subject: "Hello", // subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err)
{
    console.error("Error while sending mail:", err);
}