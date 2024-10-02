import { Request, Response } from "express";
import { assetRepository } from "../database/data-source";

//GET /assets
export async function getAllAssets(req: Request, res: Response) {
  try {
    const assets = await assetRepository.find();
    res.status(200).json({
      success: true,
      assets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
