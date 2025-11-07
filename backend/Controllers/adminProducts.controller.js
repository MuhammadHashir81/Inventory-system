import { Product } from "../Models/productSchema.js";

// Add a new product
export const adminAddProducts = async (req, res) => {
  try {
    const { name, category, description, price, inventory } = req.body;

    if (!name || !category || !description || price == null || inventory == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({ name, category, description, price, inventory });
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all products
export const gettAllAdminProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete one product
export const deleteOneAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update one product
export const updateAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, inventory } = req.body;

    const updated = await Product.findByIdAndUpdate(
      id,
      { name, category, description, price, inventory },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product updated successfully", product: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
