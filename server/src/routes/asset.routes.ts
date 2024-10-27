import {
  createAsset,
  deleteAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
} from "../controllers/asset.controller";
import { authenticateSession } from "../middlewares/session.middleware";

const express = require("express");

const assetRouter = express.Router();

assetRouter.get("/", getAllAssets);
assetRouter.get("/", getAssetById);
assetRouter.post("/", createAsset);
assetRouter.put("/", updateAsset);
assetRouter.delete("/", deleteAsset);

export default assetRouter;
