import express from "express";
import { deleteDebt, getDebts,getSearchedDebts,updatePayment } from "../Controllers/debt.controller.js";

export const debtRouter = express.Router();

debtRouter.get("/get", getDebts);
debtRouter.put("/update/:id", updatePayment);
debtRouter.delete("/delete/:id",deleteDebt)
debtRouter.get("/search",getSearchedDebts)