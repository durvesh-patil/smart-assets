import { otpRepository, userRepository } from "../database/data-source";
import { Otp } from "../database/entity/Otp";
import { User } from "../database/entity/User";

const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

export async function createUser(req, res) {
    try {
        const { email, password, otp } = req.body;
        // Check if all details are provided
        if (!email || !password || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }
        // Check if user already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        // Find the most recent OTP for the email
        const response = await otpRepository.findOne({
            where: { email },
            order: { created_at: "DESC" },
        });
        const now = new Date();
        const expiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        console.log(otp, response.otp, response)
        if (now.getTime() - new Date(response.created_at).getTime() < expiryTime || String(otp) !== String(response.otp)) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }
        // Secure password
        let hashedPassword = "";
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Hashing password error for ${password}: ` + error.message,
            });
        }
        const newUser = new User();
        newUser.email = email;
        newUser.password_hash = hashedPassword;

        await userRepository.save(newUser);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function generateOtp(req, res) {
    try {
        const { email } = req.body;
        // Check if user is already present
        const checkUserPresent = await userRepository.findOne({ where: { email } });
        // If user found with provided email
        console.log(checkUserPresent)
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User is already registered",
            });
        }
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        let result = await otpRepository.findOne({ where: { otp } });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
            result = await otpRepository.findOne({ where: { otp } });
        }
        const otpBody = new Otp();
        otpBody.email = email;
        otpBody.otp = otp;
        // otpBody.created_at = new Date().toString()
        await otpRepository.save(otpBody);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
        return res.status(400).send("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
}
