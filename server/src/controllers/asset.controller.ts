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

// GET /assets/:id
export async function getAssetById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const asset = await assetRepository.findOneBy({ id: Number(id) });
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }
    res.status(200).json({
      success: true,
      asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// POST /assets
export async function createAsset(req: Request, res: Response) {
  const assetData = req.body;
  try {
    const newAsset = await assetRepository.save(assetData);
    res.status(201).json({
      success: true,
      asset: newAsset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// PUT /assets/:id
export async function updateAsset(req: Request, res: Response) {
  const { id } = req.params;
  const updatedData = req.body; // Updated data from request body
  try {
    const asset = await assetRepository.findOneBy({ id: Number(id) });
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }
    await assetRepository.update(id, updatedData);
    const updatedAsset = await assetRepository.findOneBy({ id: Number(id) });
    res.status(200).json({
      success: true,
      asset: updatedAsset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// DELETE /assets/:id
export async function deleteAsset(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await assetRepository.delete({ id: Number(id) });
    if (result.affected === 0) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }
    res.status(204).json({
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
