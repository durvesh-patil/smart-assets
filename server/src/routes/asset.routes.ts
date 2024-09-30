import { getAllAssets } from "../controllers/asset.controller"

const express = require("express")

const assetRouter = express.Router()

assetRouter.get("/", getAllAssets)


export default assetRouter