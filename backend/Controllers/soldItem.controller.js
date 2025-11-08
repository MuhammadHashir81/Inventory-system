import { SoldItem } from "../Models/soldItem.schema.js";
import { Product } from "../Models/productSchema.js";
import { Debt } from "../Models/debt.schema.js";

// Sell Product
export const sellProduct = async (req, res) => {
  try {
    const {
      productId, type, quantity, paidAmount, customerName, shopName, city
    } = req.body;

    if (!productId || !quantity || !type) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.inventory < quantity) {
      return res.status(400).json({ success: false, message: `Not enough stock. Available: ${product.inventory}` });
    }

    const pricePerUnit = city === "johrabad" ? product.price.johrabad : product.price.other;
    const totalAmount = pricePerUnit * quantity;
    const paid = type === "full" ? totalAmount : Number(paidAmount || 0);
    const remainingAmount = totalAmount - paid;

    const soldItem = await SoldItem.create({
      productId,
      productName: product.name,
      quantity,
      city,
      type,
      pricePerUnit,
      totalAmount,
      paidAmount: paid,
      remainingAmount,
      customerName,
      shopName,
      isDebtCleared: remainingAmount === 0
    });

    // Update product stock
    product.inventory -= quantity;
    product.sold += quantity;
    await product.save();

    // If partial payment, add to debt
    if (remainingAmount > 0) {
      await Debt.create({
        soldItemId: soldItem._id,
        customerName,
        shopName,
        remainingAmount,
        city
      });
    }

    res.status(201).json({ success: true, soldItem, updatedProduct: product });
  } catch (error) {
    console.error("Sell product error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get all sold items
export const getSoldItems = async (req, res) => {
  try {
    const items = await SoldItem.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Clear debt
export const clearDebt = async (req, res) => {
  try {
    const { id } = req.params;

    const soldItem = await SoldItem.findById(id);
    if (!soldItem) return res.status(404).json({ success: false, message: "Sale not found" });

    soldItem.isDebtCleared = true;
    soldItem.remainingAmount = 0;
    await soldItem.save();

    await Debt.findOneAndDelete({ soldItemId: id });

    res.status(200).json({ success: true, message: "Debt cleared successfully", soldItem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
