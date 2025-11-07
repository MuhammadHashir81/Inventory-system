import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  verifyAdmin,
} from "../Controllers/adminAuth.controller.js";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", adminLogin);
adminAuthRouter.get("/logout", adminLogout);
adminAuthRouter.get("/verify", verifyAdmin);
