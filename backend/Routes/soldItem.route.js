import express from "express";
import { sellProducts,getSoldItems, deleteSoldItem } from "../Controllers/soldItem.controller.js";
export const soldItemRouter = express.Router();

soldItemRouter.post("/sell", sellProducts);
soldItemRouter.get("/get",getSoldItems)
soldItemRouter.get("/delete/:id",deleteSoldItem)

