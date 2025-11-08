import mongoose from "mongoose";
const { Schema } = mongoose;

const supplierAuthSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const SupplierAuth = mongoose.model("supplierAuth", supplierAuthSchema);
