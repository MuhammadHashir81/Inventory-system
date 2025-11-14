import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: {
    johrabad: { type: Number, required: true },
    other: { type: Number, required: true },
  },
  inventory: { type: Number, required: true }, // total inventory (initial stock)
  batchNo: { type: String, required: true },
  sold: { type: Number, default: 0 }, // number of items sold
});

export const Product = mongoose.model("Product", productSchema);
