//  ==================== Product Controller ====================
import { SoldItem } from "../Models/soldItem.schema.js";
import { Product } from "../Models/productSchema.js";
import { Debt } from "../Models/debt.schema.js";

// Sell Multiple Products in One Order
export const sellProducts = async (req, res) => {
  try {
    const {
      type,
      items, // Array of { productId, quantity }
      paidAmount,
      customerName,
      shopName,
      city
    } = req.body;
    
    if (!items || items.length === 0 || !type || !customerName) {
      console.log(items,customerName,type)
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields (items, type, customerName)" 
      });
    }

    // Validate and prepare order items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product not found: ${item.productId}` 
        });
      }

      if (product.inventory < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.inventory}`,
        });
      }

      // Calculate price based on city
      const pricePerUnit = city === "johrabad" 
        ? product.price.johrabad 
        : product.price.other;
      
      const itemTotal = pricePerUnit * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        pricePerUnit,
        itemTotal,
      });

      // Update product inventory
      product.inventory -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    // Calculate payment amounts
    const paid = type === "full" ? totalAmount : Number(paidAmount || 0);
    const remainingAmount = totalAmount - paid;

    // Create Sold Item
    const soldItem = await SoldItem.create({
      customerName,
      shopName,
      city,
      type,
      items: orderItems,
      totalAmount,
      paidAmount: paid,
      remainingAmount,
      isDebtCleared: remainingAmount === 0,
    });

    // If partial payment, create Debt record
    if (type === "partial" && remainingAmount > 0) {
      await Debt.create({
        soldItemId: soldItem._id,
        customerName,
        shopName,
        city,
        items: orderItems,
        totalAmount,
        paidAmount: paid,
        remainingAmount,
        payments: paid > 0 ? [{ amount: paid }] : [],
        isCleared: false,
      });
    }

    res.status(201).json({
      success: true,
      message: "Products sold successfully",
      soldItem,
    });
  } catch (error) {
    console.error("Sell products error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get all sold items
export const getSoldItems = async (req, res) => {
  try {
    const soldItems = await SoldItem.find()
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price inventory");

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
      error: error.message,
    });
  }
};