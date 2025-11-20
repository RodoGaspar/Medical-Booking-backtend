import nodemailer from "nodemailer";

//Reusable function to send email
export async function sendEmail({ to, subject, html }) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // easiest to start
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"Medical Booking" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}