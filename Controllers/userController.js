import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { userModel } from "../Models/userModel.js"
import { sendOTPEmail } from "../utils/sendemail.js"

export const requestOTP = async (req, res) => {
    try {
        const { email, name, password } = req.body
        let user = await userModel.findOne({ email })

        // If it's a registration attempt (name provided) and user doesn't exist
        if (!user && name) {
            const hashedPassword = await bcrypt.hash(password, 10)
            user = await userModel.create({ name, email, password: hashedPassword })
        } else if (!user) {
            return res.status(404).send("User not found. Please register first.")
        }

        // Generate OTP (6-digit code)
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

        user.otp = otp
        user.otpExpiresAt = otpExpiresAt
        await user.save()

        // Send Email using utility
        try {
            await sendOTPEmail(email, otp)
            console.log(`OTP sent to ${email} via email.`);
        } catch (emailError) {
            console.error("Email Dispatch Failed. Using terminal fallback:");
            console.log("-----------------------------------------");
            console.log(`>>> OTP for ${email}: ${otp} <<<`);
            console.log("-----------------------------------------");
        }

        res.status(200).json({ message: "OTP sent (check email or server console)" })
    } catch (error) {
        console.error("OTP Request Error:", error)
        res.status(500).send("Failed to send OTP")
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await userModel.findOne({ email })

        if (!user || user.otp !== otp || user.otpExpiresAt < new Date()) {
            return res.status(400).send("Invalid or expired OTP")
        }

        // Clear OTP after successful verification
        user.otp = null
        user.otpExpiresAt = null
        await user.save()

        // Issue JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.status(200).json({
            message: "Successfully verified",
            token,
            user
        })
    } catch (error) {
        console.error("OTP Verification Error:", error)
        res.status(500).send("Verification failed")
    }
}

// Registration still triggers OTP
export const adduser = async (req, res) => {
    await requestOTP(req, res)
}

// loginuser verifies password then issues JWT
export const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).send("User not found. Please register first.")
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).send("Incorrect password.")
        }

        // Issue JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.status(200).json({
            message: "Successfully login",
            token,
            user
        })
    } catch (error) {
        console.error("Login Error:", error)
        res.status(500).send(`Login failed: ${error.message}`)
    }
}
