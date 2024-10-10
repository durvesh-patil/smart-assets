import { createAssetTemplate } from "../controllers/assetTemplate.controller";
import { authenticateSession } from "../middlewares/session.middleware";

const express = require("express");

const assetTemplateRouter = express.Router();

assetTemplateRouter.post("/", createAssetTemplate);

export default assetTemplateRouter;
