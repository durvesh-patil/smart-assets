const nodemailer = require('nodemailer');
require("dotenv").config()

export async function mailSender(email: string, title: string, body: string) {
    try {
        // Create a Transporter to send emails
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // Correct Gmail SMTP host
            port: 465, // Port for secure SMTP
            secure: true, // True for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER, // Your Gmail address
                pass: process.env.MAIL_PASSWORD, // Your Gmail password or app-specific password
            }
        });
        // Send emails to users
        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: title,
            html: body,
        });
        console.log("Email info: ", info);
        return info;
    } catch (error) {
        console.log(error);
    }
};

export async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
        );
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}
// otpSchema.pre("save", async function (next) {
//     console.log("New document saved to the database");
//     // Only send an email when a new document is created
//     if (this.isNew) {
//         await sendVerificationEmail(this.email, this.otp);
//     }
//     next();
// });
