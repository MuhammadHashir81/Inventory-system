import express from "express";
import { sellProduct,getSoldItems } from "../Controllers/soldItem.controller.js";
export const soldItemRouter = express.Router();

soldItemRouter.post("/sell", sellProduct);
soldItemRouter.get("/get",getSoldItems)

