import { Router } from "express";
import {
  adminAddProducts,
  gettAllAdminProducts,
  deleteOneAdminProduct,
  updateAdminProduct,
} from "../Controllers/adminProducts.controller.js";

export const adminProductsRouter = Router();

adminProductsRouter.post("/add", adminAddProducts);
adminProductsRouter.get("/get", gettAllAdminProducts);
adminProductsRouter.delete("/delete/:id", deleteOneAdminProduct);
adminProductsRouter.put("/update/:id", updateAdminProduct);
