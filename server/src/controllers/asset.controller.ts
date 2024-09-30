import { Request, Response } from "express";
import { assetRepository } from "../database/data-source";

//GET /assets
export async function getAllAssets(req: Request, res: Response) {
  try {
    const assets = await assetRepository.find();
    return res.status(200).json({
      success: true,
      assets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
