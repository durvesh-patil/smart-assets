import {
  createAssetTemplate,
  deleteAssetTemplate,
  getAllAssetTemplates,
  getAssetTemplateById,
  updateAssetTemplate,
} from "../controllers/assetTemplate.controller";
import { authenticateSession } from "../middlewares/session.middleware";

const express = require("express");

const assetTemplateRouter = express.Router();

// GET /asset-templates
assetTemplateRouter.get("/", getAllAssetTemplates);

// GET /asset-templates/:id
assetTemplateRouter.get("/:id", getAssetTemplateById);

// POST /asset-templates
assetTemplateRouter.post("/", createAssetTemplate);

// PUT /asset-templates/:id
assetTemplateRouter.put("/:id", updateAssetTemplate);

// DELETE /asset-templates/:id
assetTemplateRouter.delete("/:id", deleteAssetTemplate);

export default assetTemplateRouter;
