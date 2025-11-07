import mongoose from "mongoose";
const { Schema } = mongoose;

const adminAuthSchema = new Schema({
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

export const AdminAuth = mongoose.model("AdminAuth", adminAuthSchema);
