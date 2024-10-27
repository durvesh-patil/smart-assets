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

// GET /templates
assetTemplateRouter.get("/", getAllAssetTemplates);

// GET /templates/:id
assetTemplateRouter.get("/:id", getAssetTemplateById);

// POST /templates
assetTemplateRouter.post("/", createAssetTemplate);

// PUT /templates/:id
assetTemplateRouter.put("/:id", updateAssetTemplate);

// DELETE /templates/:id
assetTemplateRouter.delete("/:id", deleteAssetTemplate);

export default assetTemplateRouter;
