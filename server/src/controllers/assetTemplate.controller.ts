import { Request, Response } from "express";
import { AssetTemplate } from "../database/entity/AssetTemplate";
import { assetTemplateRepository } from "../database/data-source";

// GET /asset-templates
export async function getAllAssetTemplates(req: Request, res: Response) {
  try {
    const assetTemplates = await assetTemplateRepository.find();
    res.status(200).json({
      success: true,
      assetTemplates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// GET /asset-templates/:id
export async function getAssetTemplateById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const assetTemplate = await assetTemplateRepository.findOneBy({
      id: Number(id),
    });
    if (!assetTemplate) {
      return res.status(404).json({
        success: false,
        message: "Asset template not found",
      });
    }
    res.status(200).json({
      success: true,
      assetTemplate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// POST /asset-templates
export async function createAssetTemplate(req: Request, res: Response) {
  const assetTemplateData = req.body; // Assume the asset template data is in the request body
  try {
    const newAssetTemplate = await assetTemplateRepository.save(
      assetTemplateData
    );
    res.status(201).json({
      success: true,
      assetTemplate: newAssetTemplate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// PUT /asset-templates/:id
export async function updateAssetTemplate(req: Request, res: Response) {
  const { id } = req.params;
  const updatedData = req.body; // Updated data from request body
  try {
    const assetTemplate = await assetTemplateRepository.findOneBy({
      id: Number(id),
    });
    if (!assetTemplate) {
      return res.status(404).json({
        success: false,
        message: "Asset template not found",
      });
    }
    await assetTemplateRepository.update(id, updatedData);
    const updatedAssetTemplate = await assetTemplateRepository.findOneBy({
      id: Number(id),
    });
    res.status(200).json({
      success: true,
      assetTemplate: updatedAssetTemplate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// DELETE /asset-templates/:id
export async function deleteAssetTemplate(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await assetTemplateRepository.delete({ id: Number(id) });
    if (result.affected === 0) {
      return res.status(404).json({
        success: false,
        message: "Asset template not found",
      });
    }
    res.status(204).json({
      success: true,
      message: "Asset template deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
