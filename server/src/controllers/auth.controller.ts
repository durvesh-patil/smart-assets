import { otpRepository, userRepository } from "../database/data-source";
import { Otp } from "../database/entity/Otp";
import { User } from "../database/entity/User";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken"; // Import jwt here
import dotenv from "dotenv";

dotenv.config();

// POST /register
export async function createUser(req, res) {
    const { email, password } = req.body; // Assuming you are sending email and password

    try {
        // Check if all details are provided
        if (!email || !password) {
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

// POST /login
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
