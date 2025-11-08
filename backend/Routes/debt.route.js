import express from "express";
import { getAllDebts,removeDebt } from "../Controllers/debt.controller.js";

export const debtRouter = express.Router();
debtRouter.get("/get", getAllDebts);
debtRouter.delete("/remove/:id", removeDebt);


