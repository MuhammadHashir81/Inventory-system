import { Debt } from "../Models/debt.schema.js";
import { SoldItem } from "../Models/soldItem.schema.js";

// Get all debts
export const getDebts = async (req, res) => {
  try {
    const debts = await Debt.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, debts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching debts", error });
  }
};

// Update payment
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    let { payment } = req.body;

    const debt = await Debt.findById(id);
    if (!debt) return res.status(404).json({ success: false, message: "Debt not found" });

    if (payment > debt.remainingAmount) {
      payment = debt.remainingAmount;
    }

    debt.paidAmount = parseFloat((debt.paidAmount + payment).toFixed(2));
    debt.remainingAmount = parseFloat((debt.totalAmount - debt.paidAmount).toFixed(2));
    debt.payments.push({ amount: payment });

    if (debt.remainingAmount <= 0.01) {
      debt.remainingAmount = 0;
      debt.isCleared = true;

      await SoldItem.findByIdAndUpdate(debt.soldItemId, {
        isDebtCleared: true,
        remainingAmount: 0,
        paidAmount: debt.totalAmount,
      });
    } else {
      await SoldItem.findByIdAndUpdate(debt.soldItemId, {
        paidAmount: debt.paidAmount,
        remainingAmount: debt.remainingAmount,
      });
    }

    await debt.save();
    res.status(200).json({ success: true, message: "Payment updated", debt });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ success: false, message: "Error updating payment", error });
  }
};
