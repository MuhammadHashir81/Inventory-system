// controllers/adminProducts.controller.js
import { Product } from "../Models/productSchema.js";

// ➕ Add a new product
export const adminAddProducts = async (req, res) => {
  try {
    const { name, category, description, priceJohrabad, priceOther, inventory, sold = 0 } = req.body;

    if (!name || !category || !description || priceJohrabad == null || priceOther == null || inventory == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({
      name,
      category,
      description,
      price: { johrabad: priceJohrabad, other: priceOther },
      inventory,
      sold,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 📦 Get all products
export const gettAllAdminProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ❌ Delete product
export const deleteOneAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✏️ Update product
export const updateAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, priceJohrabad, priceOther, inventory, sold } = req.body;

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        category,
        description,
        price: { johrabad: priceJohrabad, other: priceOther },
        inventory,
        sold,
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product updated successfully", product: updated });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
