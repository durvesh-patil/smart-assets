import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv"
import authRouter from "../routes/auth.routes";
config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => res.send("hello worlddddd"));

app.use("/api/v1/auth", authRouter);

export default app