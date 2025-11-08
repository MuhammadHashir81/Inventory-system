// backend/Controllers/supplierAuth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SupplierAuth } from "../Models/supplierAuth.schema.js";

const maxAge = 24 * 60 * 60; // 1 day

// Create JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SUPPLIER_LOGIN_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

// Seed Default Supplier
export const seedSupplier = async () => {
  const existingSupplier = await SupplierAuth.findOne({ name: "supplier" });
  if (!existingSupplier) {
    const hashedPassword = await bcrypt.hash("thisissupplier", 10);
    await SupplierAuth.create({ name: "supplier", password: hashedPassword });
    console.log("✅ Default supplier created");
  } else {
    console.log("⚙️ Supplier already exists");
  }
};
seedSupplier();

// Supplier Login
export const supplierLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log(name,password)

    if (!name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const supplier = await SupplierAuth.findOne({ name });
    if (!supplier) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken(supplier._id);
    res.cookie("supplierJWT", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Supplier logged in successfully", token });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err)
  }
};

// Supplier Logout
export const supplierLogout = (req, res) => {
  try {
    res.cookie("supplierJWT", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify Supplier
export const verifySupplier = async (req, res) => {
  try {
    const token = req.cookies.supplierJWT;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.SUPPLIER_LOGIN_SECRET_KEY);
    const supplier = await SupplierAuth.findById(decoded.id).select("-password");
    if (!supplier) return res.status(401).json({ error: "Invalid token" });

    res.status(200).json({ success: true, supplier });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
