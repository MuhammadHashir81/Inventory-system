import express from "express";
import { getDebts,updatePayment } from "../Controllers/debt.controller.js";

export const debtRouter = express.Router();

debtRouter.get("/get", getDebts);
debtRouter.put("/update/:id", updatePayment);
