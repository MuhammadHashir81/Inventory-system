import mongoose from "mongoose";

const debtSchema = new mongoose.Schema({
  soldItemId: { type: mongoose.Schema.Types.ObjectId, ref: "SoldItem" },
  customerName: { type: String, required: true },
  shopName: { type: String },
  city: { type: String, required: true },
  remainingAmount: { type: Number, required: true },
}, { timestamps: true });

export const Debt = mongoose.model("Debt", debtSchema);
