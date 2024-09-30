import { getAllAssets } from "../controllers/asset.controller";
import { authenticateSession } from "../middlewares/session.middleware";

const express = require("express");

const assetRouter = express.Router();

assetRouter.get("/", authenticateSession, getAllAssets);

export default assetRouter;
