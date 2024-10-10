import { Request, Response } from "express";
import { AssetTemplate } from "../database/entity/AssetTemplate";
import { assetTemplateRepository } from "../database/data-source";

export async function createAssetTemplate(req: Request, res: Response) {
  try {
    const { name, created_by, notes, fields } = req.body;

    const assetTemplate = new AssetTemplate();
    assetTemplate.name = name;
    // currently setting to null
    assetTemplate.created_by = created_by || null;
    assetTemplate.notes = notes;
    assetTemplate.fields = fields;
    const result = await assetTemplateRepository.save(assetTemplate);
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
}
