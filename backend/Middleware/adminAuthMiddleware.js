import jwt from "jsonwebtoken";
import { AdminAuth } from "../Models/adminAuth.schema.js";

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.adminJWT;
    if (!token) return res.status(401).json({ error: "Not authorized" });

    const decoded = jwt.verify(token, process.env.ADMIN_LOGIN_SECRET_KEY);
    const admin = await AdminAuth.findById(decoded.id);
    if (!admin) return res.status(401).json({ error: "Invalid admin" });

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
