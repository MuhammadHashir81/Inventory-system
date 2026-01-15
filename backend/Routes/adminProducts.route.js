  import express from "express";
  import {
    adminAddProducts,
    gettAllAdminProducts,
    deleteOneAdminProduct,
    updateAdminProduct,
    getLowStockProducts,
    getSearchedItems
  } from "../Controllers/adminProducts.controller.js";

  export const adminProductsRouter = express.Router();

  adminProductsRouter.post("/add", adminAddProducts);
  adminProductsRouter.get("/get", gettAllAdminProducts);
  adminProductsRouter.delete("/delete/:id", deleteOneAdminProduct);
  adminProductsRouter.put("/update/:id", updateAdminProduct);
  adminProductsRouter.get("/low-stock-products", getLowStockProducts);
  adminProductsRouter.get("/search",getSearchedItems)
