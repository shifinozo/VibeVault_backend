import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"VibeVault" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "VibeVault OTP Verification",
        html: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`,
    });
};