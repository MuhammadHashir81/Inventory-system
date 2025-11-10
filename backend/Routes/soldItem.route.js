import express from "express";
import { sellProducts,getSoldItems } from "../Controllers/soldItem.controller.js";
export const soldItemRouter = express.Router();

soldItemRouter.post("/sell", sellProducts);
soldItemRouter.get("/get",getSoldItems)

