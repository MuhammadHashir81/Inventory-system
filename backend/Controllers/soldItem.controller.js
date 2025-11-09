import { SoldItem } from "../Models/soldItem.schema.js";
import { Product } from "../Models/productSchema.js";

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

    // Validate required fields
    if (!productId || !quantity || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Check stock
    if (product.inventory < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock. Available: ${product.inventory}`,
      });
    }

    // Calculate prices
    const pricePerUnit =
      city === "johrabad" ? product.price.johrabad : product.price.other;

    const totalAmount = pricePerUnit * quantity;
    const paid = type === "full" ? totalAmount : Number(paidAmount || 0);
    const remainingAmount = totalAmount - paid;

    // Create sold item record
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

    // Update product stock
    product.inventory -= quantity;
    product.sold += quantity;
    await product.save();

    // Send response
    res.status(201).json({
      success: true,
      message: "Product sold successfully",
      soldItem,
      updatedProduct: product,
    });
  } catch (error) {
    console.error("Sell product error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// get sold items



// Get all sold items
export const getSoldItems = async (req, res) => {
  try {
    // Fetch all sold items sorted by newest first
    const soldItems = await SoldItem.find()
      .sort({ createdAt: -1 })
      .populate("productId", "name"); // optional: fetch product name from Product model

    // If no sold items found
    if (!soldItems || soldItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No sold items found",
        items: [],
      });
    }

    // Return all sold items
    res.status(200).json({
      success: true,
      message: "Sold items fetched successfully",
      items: soldItems,
    });
  } catch (error) {
    console.error("Get sold items error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching sold items",
      error,
    });
  }
};
