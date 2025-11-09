import { SoldItem } from "../Models/soldItem.schema.js";
import { Product } from "../Models/productSchema.js";
import { Debt } from "../Models/debt.schema.js";
// Sell Product
export const sellProduct = async (req, res) => {
  try {
    const {
      productId,
      type,
      quantity,
      paidAmount,
      customerName,
      shopName,
      city
    } = req.body;

    if (!productId || !quantity || !type) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.inventory < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock. Available: ${product.inventory}`,
      });
    }

    // ✅ Use your existing city-based pricing
    const pricePerUnit =
      city === "johrabad" ? product.price.johrabad : product.price.other;

    const totalAmount = pricePerUnit * quantity;
    const paid = type === "full" ? totalAmount : Number(paidAmount || 0);
    const remainingAmount = totalAmount - paid;

    // ✅ Create Sold Item
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
      isDebtCleared: remainingAmount === 0,
    });

    // ✅ Update Product Stock
    product.inventory -= quantity;
    product.sold += quantity;
    await product.save();

    // ✅ If it's a partial payment, also create a Debt record
    if (type === "partial" && remainingAmount > 0) {
      await Debt.create({
        soldItemId: soldItem._id,
        customerName,
        productName: product.name,
        shopName,
        city,
        totalAmount,
        paidAmount: paid,
        remainingAmount,
        payments: [{ amount: paid }],
        isCleared: false,
      });
    }

    res.status(201).json({
      success: true,
      message: "Product sold successfully",
      soldItem,
    });
  } catch (error) {
    console.error("Sell product error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// sold items

export const getSoldItems = async (req, res) => {
  try {
    // Fetch all sold items, most recent first
    const soldItems = await SoldItem.find()
      .sort({ createdAt: -1 })
      .populate("productId", "name price inventory"); // Optional: populate product details

    res.status(200).json({
      success: true,
      message: "Sold items fetched successfully",
      soldItems,
    });
  } catch (error) {
    console.error("Error fetching sold items:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sold items",
      error,
    });
  }
};