import { userRepository } from "../database/data-source";
import { User } from "../database/entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import jwt here
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

// POST /register
export async function createUser(req: Request, res: Response) {
  const { email, password } = req.body; // Assuming you are sending email and password

  try {
    // Check if all details are provided
    if (!email || !password) {
      res.status(403).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    // Secure password
    let hashedPassword = "";
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Hashing password error for ${password}: ` + error.message,
      });
      return;
    }

    const newUser = new User();
    newUser.email = email;
    newUser.password_hash = hashedPassword;

    await userRepository.save(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
    return;
  }
}

// POST /login
export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(400).send("Invalid credentials");
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(400).send("Invalid credentials");
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", token });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
    return;
  }
}
