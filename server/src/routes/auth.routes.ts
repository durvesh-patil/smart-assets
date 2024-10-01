// src/routes/auth.routes.ts

import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);

export default authRouter;
