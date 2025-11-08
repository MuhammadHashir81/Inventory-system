import express from "express";
import { sellProduct,getSoldItems,clearDebt } from "../controllers/soldItem.controller.js";

export const soldItemRouter = express.Router();
soldItemRouter.post("/sell", sellProduct);
soldItemRouter.get("/get", getSoldItems);
soldItemRouter.put("/clear-debt/:id", clearDebt);

