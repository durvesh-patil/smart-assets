import { createUser, generateOtp, loginUser } from "../controllers/auth.controller";
const express = require("express")

const authRouter = express.Router()

authRouter.post("/register", createUser)

authRouter.post("/generate_otp", generateOtp)

authRouter.post("/login", loginUser)

export default authRouter