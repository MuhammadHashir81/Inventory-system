import { Debt } from "../Models/debt.schema.js";
import { SoldItem } from "../Models/soldItem.schema.js";

// Get all debts
export const getAllDebts = async (req, res) => {
  try {
    const debts = await Debt.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, debts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Remove a debt manually
export const removeDebt = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Debt.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Debt not found" });
    res.status(200).json({ success: true, message: "Debt removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
