import mongoose from "mongoose";

const soldItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  city: { type: String, default: "johrabad" },
  type: { type: String, enum: ["full", "partial"], required: true },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  customerName: String,
  shopName: String,
  isDebtCleared: { type: Boolean, default: false },
}, { timestamps: true });

export const SoldItem = mongoose.model("SoldItem", soldItemSchema);
