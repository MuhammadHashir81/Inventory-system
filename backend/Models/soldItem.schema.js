// ==================== SoldItem Schema ====================
import mongoose from "mongoose";

const soldItemSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  shopName: { type: String },
  city: { type: String, default: "johrabad" },
  type: { type: String, enum: ["full", "partial"], required: true },
  
  // Array of products in this order
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      pricePerUnit: { type: Number, required: true },
      itemTotal: { type: Number, required: true }, // quantity * pricePerUnit
    }
  ],
  batchNo: { type: String, required: true },
  totalAmount: { type: Number, required: true }, // Sum of all itemTotal
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  isDebtCleared: { type: Boolean, default: false },
}, { timestamps: true });

export const SoldItem = mongoose.model("SoldItem", soldItemSchema);