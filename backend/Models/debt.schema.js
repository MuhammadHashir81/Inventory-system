
import mongoose from "mongoose";
const debtSchema = new mongoose.Schema({
  soldItemId: { type: mongoose.Schema.Types.ObjectId, ref: "SoldItem", required: true },
  customerName: { type: String, required: true },
  shopName: { type: String },
  city: { type: String, default: "johrabad" },
  
  // Array of products that have pending payment
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      pricePerUnit: { type: Number, required: true },
      itemTotal: { type: Number, required: true },
      batchNo: { type: String, required: true },
    }
  ],
  
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, required: true },
  
  payments: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
    }
  ],
  
  isCleared: { type: Boolean, default: false },
}, { timestamps: true });

export const Debt = mongoose.model("Debt", debtSchema);