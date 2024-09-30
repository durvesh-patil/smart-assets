import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
config();

export async function authenticateSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("Unauthorized");
  }
}
