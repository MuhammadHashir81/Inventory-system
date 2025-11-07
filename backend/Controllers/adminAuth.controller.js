import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminAuth } from "../Models/adminAuth.schema.js";

const maxAge = 24 * 60 * 60; // 1 day

// 🔹 Create JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.ADMIN_LOGIN_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

// 🔹 Seed Default Admin (Only one)
export const seedAdmin = async () => {
  const existingAdmin = await AdminAuth.findOne({ name: "admin" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("thisisadmin", 10);
    await AdminAuth.create({ name: "admin", password: hashedPassword });
    console.log("✅ Default admin created");
  } else {
    console.log("⚙️ Admin already exists");
  }
};

// 🔹 Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const admin = await AdminAuth.findOne({ name });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken(admin._id);
    res.cookie("adminJWT", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: "Admin logged in successfully", token });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🔹 Admin Logout
export const adminLogout = (req, res) => {
  try {
    res.cookie("adminJWT", "", { maxAge: 0 });
    res.status(200).json({ success: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🔹 Check Admin Authentication
export const verifyAdmin = async (req, res) => {
  try {
    const token = req.cookies.adminJWT;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.ADMIN_LOGIN_SECRET_KEY);
    const admin = await AdminAuth.findById(decoded.id).select("-password");
    if (!admin) return res.status(401).json({ error: "Invalid token" });

    res.status(200).json({ success: true, admin });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
