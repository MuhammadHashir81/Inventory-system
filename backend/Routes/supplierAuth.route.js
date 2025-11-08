// backend/Routes/supplierAuth.route.js
import { Router } from "express";
import { supplierLogin, supplierLogout, verifySupplier } from "../Controllers/supplierAuth.controller.js";

export const supplierAuthRouter = Router();

supplierAuthRouter.post("/login", supplierLogin);
supplierAuthRouter.post("/logout", supplierLogout);
supplierAuthRouter.get("/verify", verifySupplier);
