import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import authRouter from "../routes/auth.routes";
import assetRouter from "../routes/asset.routes";
config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("hello worlddddd");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/assets", assetRouter);

export default app;
